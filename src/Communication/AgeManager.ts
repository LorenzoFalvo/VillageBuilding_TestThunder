import { Log } from "@gamindo/thunder";
import EmbeddedAPI from "./EmbeddedAPI";
import { MIME_TYPE, REQUEST_TYPE } from "./NetworkManager";

export default class AgeManager {
    protected static instance: AgeManager;

    protected readonly host: string = import.meta.env.VITE_ENDPOINT_AGE;
    protected readonly gid: string = import.meta.env.VITE_GID;

    private constructor() {}

    public static get Instance(): AgeManager {
        if (!this.instance) {
            this.instance = new AgeManager();
        }

        return this.instance;
    }

    public UserOpenGame(): void {
        this.UserInteraction("user_access");
    }

    public UserInteraction(key: string): void {
        if (!EmbeddedAPI.player) {
            Log.error("Calling Age without player data");
            return;
        }

        fetch(`${this.host}`, {
            method: REQUEST_TYPE.POST,
            cache: "no-cache",
            mode: "no-cors",
            redirect: "follow",
            headers: {
                "Content-Type": MIME_TYPE.JSON,
            },
            body: JSON.stringify({
                uid: EmbeddedAPI.player.pid,
                gid: this.gid,
                key,
            }),
        });
    }

    public UserStartGame(): void {
        this.UserInteraction("user_start_game");
    }
}
