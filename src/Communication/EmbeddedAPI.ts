import NetworkManager, { REQUEST_TYPE } from "./NetworkManager";
import SaveManager from "./SaveManager";

export abstract class PlayerData {
    public readonly pid: string = "";
    public username: string = "";
    public surname: string = "";
    public email: string = "";
    public details: string = "";

    constructor() {}

    public IsGuest(): boolean {
        return this.email !== "";
    }

    public Details(): any {
        return JSON.parse(this.details);
    }
}

export interface IRankingData {
    id: string;
    username: string;
    score: number;
    itsMe: boolean;
}

// TODO: Add personal ranking
export interface IRankingGroup {
    allTime: IRankingData[];
    weekly: IRankingData[];
    daily: IRankingData[];
}

export interface IPlayerData {
    commercial_consent: boolean;
    email?: string;
    username?: string;
    details?: string;
    rid?: string | null;
    is_room_admin?: boolean;
}

export interface IPlayerUpdateData {
    email?: string;
    username?: string;
    details?: string;
    rid?: string | null;
    is_room_admin?: boolean;
}

export default class EmbeddedAPI {
    public static player: PlayerData;

    constructor() {}

    public static async Init(): Promise<boolean> {
        const saveManager = SaveManager.Instance;
        const player = await saveManager.GetValue("GET_USER");

        if (player) {
            try {
                const userData = JSON.parse(player);
                this.InitPlayer(userData.userId);
                return true;
            } catch (error) {}
        }

        const data = await this.InitPlayer();
        return data !== undefined;
    }

    //////////////////
    // User section //
    //////////////////
    /**
     * Initialize the player for this game
     * @param code External provider player id
     * @returns PlayerData with player information
     */
    public static async InitPlayer(code?: string): Promise<PlayerData> {
        const saveManager = SaveManager.Instance;

        if (code) {
            this.player = await this.CreatePlayer({
                email: `${code}@email.com`,
                commercial_consent: true,
            });
        } else {
            const pid = await saveManager.GetValue("pid");
            if (pid != "") {
                // Player found, get it
                this.player = await this.GetPlayer(pid);
            } else {
                // Player not found, create it
                this.player = await this.CreatePlayer({
                    commercial_consent: false,
                });
            }
        }

        return this.player;
    }

    public static async CreatePlayer(data: IPlayerData): Promise<PlayerData> {
        const player: PlayerData = await NetworkManager.RequestWithToken(
            `${import.meta.env.VITE_ENDPOINT}/${import.meta.env.VITE_ENDPOINT_V}/players`,
            REQUEST_TYPE.POST,
            {
                cid: import.meta.env.VITE_CID,
                ...data,
            },
        );

        if (player) {
            SaveManager.Instance.SetValue("pid", player.pid);
        }

        return player as PlayerData;
    }

    public static async UpdatePlayer(pid: string, data: IPlayerUpdateData): Promise<PlayerData> {
        const player = await NetworkManager.RequestWithToken(
            `${import.meta.env.VITE_ENDPOINT}/${import.meta.env.VITE_ENDPOINT_V}/players/${pid}`,
            REQUEST_TYPE.PUT,
            {
                cid: import.meta.env.VITE_CID,
                ...data,
            },
        );

        return player as PlayerData;
    }

    public static async UpdatePlayerDetails(pid: string, data: any): Promise<PlayerData> {
        return this.UpdatePlayer(pid, { details: JSON.stringify(data) });
    }

    public static async GetPlayer(pid: string): Promise<PlayerData> {
        const player = await NetworkManager.RequestWithToken(
            `${import.meta.env.VITE_ENDPOINT}/${import.meta.env.VITE_ENDPOINT_V}/players/${pid}`,
            REQUEST_TYPE.GET,
        );

        return player as PlayerData;
    }

    /////////////////
    // Transaction //
    /////////////////
    // TODO: return transaction data
    public static async Transaction(score: number): Promise<void> {
        await NetworkManager.RequestWithToken(
            `${import.meta.env.VITE_ENDPOINT}/${import.meta.env.VITE_ENDPOINT_V}/transactions`,
            REQUEST_TYPE.POST,
            {
                pid: this.player.pid,
                gid: import.meta.env.VITE_GID,
                value: score,
            },
        );
    }

    //////////////
    // Rankings //
    //////////////
    public static async GetRanking(list: number = 5, ghost_required: boolean = false): Promise<IRankingData[]> {
        const ranking = (await NetworkManager.RequestWithToken(
            `${import.meta.env.VITE_ENDPOINT}/${import.meta.env.VITE_ENDPOINT_V_RANK}/rankings/${
                import.meta.env.VITE_GID
            }?l=${list}&ranking_type=allTime&ghost_required=${ghost_required ? 1 : 0}`,
            REQUEST_TYPE.GET,
        )) as IRankingGroup;

        return ranking.allTime as IRankingData[];
    }
}
