import { Log } from "@gamindo/thunder";

export interface IErrorResponse {
    success: boolean;
    message: string;
}

export interface IMessageListener {
    key: string;
    callback: (value: string) => void;
}

export interface IMessageData {
    eventName: string;
    payload: object;
}

export default class SaveManager {
    protected static instance: SaveManager;

    public readonly gid: string = import.meta.env.VITE_GID;
    public readonly cid: string = import.meta.env.VITE_CID;
    public readonly isStorageAvailable: boolean = true;

    private readonly isInIFrame: boolean = false;
    private readonly storage!: Storage;

    protected postMessageListeners: IMessageListener[] = [];

    private constructor() {
        this.isInIFrame = window.location !== window.parent.location;

        if (!this.isInIFrame) {
            this.storage = window.localStorage;
        } else {
            this.postMessageListeners = new Array<IMessageListener>();
            window.addEventListener("message", this.GetMessage.bind(this));
        }

        this.isStorageAvailable = this.CheckStorage();
    }

    public static get Instance(): SaveManager {
        if (!SaveManager.instance) {
            this.instance = new SaveManager();
        }

        return this.instance;
    }

    private GetMessage(ev: MessageEvent<any>): void {
        try {
            Log.log(`Message from parent: ${ev.data}`);

            const data = JSON.parse(ev.data) as IMessageData;
            for (let l = this.postMessageListeners.length - 1; l > -1; l--) {
                if (this.postMessageListeners[l].key === data.eventName) {
                    this.postMessageListeners[l].callback(JSON.stringify(data.payload));
                    this.postMessageListeners.splice(l, 1);
                }
            }
        } catch (e) {
            console.error(e);
        }
    }

    private CheckStorage(): boolean {
        try {
            var x = "__storage_test__";
            this.storage.setItem(x, x);
            this.storage.removeItem(x);
            return true;
        } catch (e) {
            Log.warn("No storage available 😱");
            return false;
        }
    }

    protected async GetData(key: string): Promise<string> {
        return new Promise<string>((resolve: (value: string) => void, reject: (reason: IErrorResponse) => void) => {
            if (this.isInIFrame) {
                Log.log(`Getting data from parent: ${key}`);
                this.postMessageListeners.push({
                    callback: resolve,
                    key,
                });
                parent.postMessage(JSON.stringify({ eventName: key, payload: {} } as IMessageData), "*");

                // After 100ms check if the event id waiting, if so end the callback
                setTimeout(() => {
                    for (let l = 0; l < this.postMessageListeners.length; l++) {
                        if (this.postMessageListeners[l].key === key) {
                            Log.warn(`Timeout for request ${key}`);
                            this.postMessageListeners[l].callback(JSON.stringify({}));
                        }
                    }
                }, 1000);
            } else if (this.isStorageAvailable) {
                Log.log(`Getting data from storage: ${key}`);
                resolve(this.storage.getItem(this.GetGameKey(key)) || "");
            } else {
                Log.warn(`Error getting ${key}`);
                reject({ success: false, message: `Error getting ${key}` });
            }
        });
    }

    /**
     * Get an object saved locally in local storage or server side
     * @param key Key for the object you want to retrieve
     * @param local Boolean to server side or local objects
     * @returns Object stored in the correspondent key
     */
    public async GetObject<T>(key: string): Promise<T> {
        return new Promise<T>((resolve: (value: T) => void, reject: (reason: IErrorResponse) => void) => {
            this.GetData(key).then((value) => {
                // Convert empty values in objects
                if (value == "") value = "{}";
                try {
                    const result = JSON.parse(value) as T;
                    resolve(result);
                } catch (e) {
                    Log.warn("Error parsing JSON object");
                    reject({ message: "Error parsing JSON object", success: false });
                }
            });
        });
    }

    /**
     * Get the string saved locally in local storage or server side
     * @param key Key for the object you want to retrieve
     * @param local Boolean to server side or local objects
     * @returns String stored in the correspondent key
     */
    public async GetValue(key: string): Promise<string> {
        return this.GetData(key);
    }

    /**
     * Save an object locally or server side
     * @param key Key that represent this object
     * @param value Value to save
     * @param local Save it locally in local storage or server side
     * @returns Boolean response for correct operation
     */
    public async SetObject(key: string, value: object): Promise<boolean> {
        const sendData = this.isInIFrame ? { eventName: key, payload: value } : value;
        return this.SetData(key, JSON.stringify(sendData));
    }

    /**
     * Save a string locally or server side
     * @param key Key that represent this object
     * @param value Value to save
     * @param local Save it locally in local storage or server side
     * @returns Boolean response for correct operation
     */
    public async SetValue(key: string, value: string): Promise<boolean> {
        const sendData = this.isInIFrame ? JSON.stringify({ eventName: key, payload: { key: value } }) : value;
        return this.SetData(key, sendData);
    }

    private async SetData(key: string, value: string): Promise<boolean> {
        return new Promise<boolean>((resolve: (value: boolean) => void, reject: (reason: any) => void) => {
            Log.log(`Setting data in storage: ${key} -> ${value}`);

            if (this.isInIFrame) {
                Log.warn(`Asking to parent: ${key}: ${value}`);
                parent.postMessage(value, "*");
                resolve(true);
            } else if (this.isStorageAvailable) {
                this.storage.setItem(this.GetGameKey(key), value);
                resolve(true);
            } else {
                Log.warn(`Error saving ${key}: ${value}`);
                reject("error");
            }
        });
    }

    /**
     * Get a key value that represent this game and this build mode
     * @param value key string to encode
     * @returns key string escaped by game code and mode
     */
    protected GetGameKey(value: string): string {
        return `${import.meta.env.VITE_CODE}_${import.meta.env.MODE.substring(0, 3)}_${value}_${
            import.meta.env.VITE_GID
        }`;
    }

    /**
     * Remove the specified key data
     * @param key Key representing the value to be removed
     */
    public Remove(key: string): void {
        if (!this.isInIFrame) {
            this.storage.removeItem(key);
        }
    }

    /**
     * Clear all data
     */
    public Clear(): void {
        if (!this.isInIFrame) {
            this.storage.clear();
        }
    }
}
