import { Log } from "@gamindo/thunder";
import SaveManager, { IErrorResponse } from "./SaveManager";

export enum REQUEST_TYPE {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
}

export enum MIME_TYPE {
    TEXT = "text/plain",
    JSON = "application/json",
    XFORM = "application/x-www-form-urlencoded",
}

export enum SERVER_ERROR {
    GENERIC = 400,
    TOKEN_EXPIRED = 401,
    MAX_ERROR_CODE = 499,
}

export default class NetworkManager {
    public static readonly isOnline: boolean = window.navigator.onLine;
    private static readonly application: string = import.meta.env.VITE_AUTH_BEARER;
    private static readonly hostToken: string = `${import.meta.env.VITE_ENDPOINT_AUTH}/tokens`;
    private static token: string = "";

    public static Request<T>(url: string, type: REQUEST_TYPE, body?: any): Promise<T> {
        return fetch(url, {
            method: type,
            cache: "no-cache",
            mode: "no-cors",
            headers: {
                "X-Requested-With": "XMLHttpRequest",
                "Content-Type": MIME_TYPE.JSON,
            },
            body: body ? JSON.stringify(body) : undefined,
        })
            .then((response) => {
                return response.json() as Promise<T>;
            })
            .catch((error: Error) => {
                Log.error(error.message);
                throw error;
            });
    }

    public static RequestWithToken<T>(url: string, type: REQUEST_TYPE, body?: any, maxRetry: number = 3): Promise<T> {
        return new Promise<T>((res: (v: T) => void, rej: (error: IErrorResponse) => void) => {
            // Too much recursion check
            if (maxRetry <= 0) {
                Log.warn(`Max request attempt reached: ${url}`);
                rej({ success: false, message: "📬 Reached max attempts" });
            } else {
                this.TokenLogic()
                    .then(() => {
                        // Token ready, continue with request
                        fetch(url, {
                            method: type,
                            cache: "no-cache",
                            headers: {
                                "X-Requested-With": "XMLHttpRequest",
                                "Content-Type": MIME_TYPE.JSON,
                                Authorization: `Bearer ${this.token}`,
                            },
                            body: body ? JSON.stringify(body) : undefined,
                        })
                            .then((response) => {
                                if (!response.ok) {
                                    if (
                                        response.status >= SERVER_ERROR.GENERIC &&
                                        response.status <= SERVER_ERROR.MAX_ERROR_CODE
                                    ) {
                                        switch (response.status) {
                                            case SERVER_ERROR.TOKEN_EXPIRED:
                                                this.token = "";

                                                this.RequestToken().then(() => {
                                                    this.RequestWithToken<T>(url, type, body, maxRetry - 1).then(
                                                        (v) => {
                                                            res(v);
                                                        },
                                                    );
                                                });
                                                break;

                                            default:
                                                Log.error(`${response.statusText} (${response.status})`);
                                                response.json().then((v) => {
                                                    rej(v);
                                                });
                                                break;
                                        }
                                    }

                                    // Server error, stop all logic execution
                                    else if (response.status >= 500) {
                                        Log.error(response.statusText);
                                        response.json().then((v) => {
                                            rej(v);
                                        });
                                    }
                                } else {
                                    (response.json() as Promise<T>).then((v) => {
                                        res(v);
                                    });
                                }
                            })
                            .catch(() => {
                                rej({ success: false, message: "Network error 🚾" });
                            });
                    })
                    .catch(() => {
                        // Token missing
                        this.RequestToken().then(() => {
                            this.RequestWithToken<T>(url, type, body, maxRetry - 1).then((v) => {
                                res(v);
                            });
                        });
                    });
            }
        });
    }

    public static GetQueryStringParam(key: string): string | null {
        const params = new URLSearchParams(window.location.search);
        return params.get(key);
    }

    protected static TokenLogic(): Promise<void> {
        return new Promise<void>((resolve: () => void, reject: () => void) => {
            if (this.token == "") {
                if (SaveManager.Instance.isStorageAvailable) {
                    SaveManager.Instance.GetValue("t").then((v) => {
                        if (v != "") {
                            this.token = v;
                            resolve();
                        } else {
                            reject();
                        }
                    });
                } else {
                    reject();
                }
            } else {
                resolve();
            }
        });
    }

    protected static RequestToken(): Promise<void> {
        return fetch(this.hostToken, {
            method: REQUEST_TYPE.GET,
            cache: "no-cache",
            headers: {
                "X-Requested-With": "XMLHttpRequest",
                "Content-Type": MIME_TYPE.JSON,
                Authorization: this.application,
            },
        }).then((response) => {
            return new Promise<void>((resolve: () => void, reject: (value: string) => void) => {
                if (!response.ok) {
                    Log.error(response.statusText);
                    reject(response.statusText);
                } else {
                    response.json().then((value: { token: string; success: boolean; message?: string }) => {
                        if (value.success) {
                            this.token = value.token;
                            if (SaveManager.Instance.isStorageAvailable) {
                                SaveManager.Instance.SetValue("t", this.token);
                            }
                            resolve();
                        } else {
                            Log.error(value.message);
                            reject(value.message || "");
                        }
                    });
                }
            });
        });
    }
}
