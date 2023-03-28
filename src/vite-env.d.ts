/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_VERSION: string;
    readonly VITE_NAME: string;
    readonly VITE_WIDTH: string;
    readonly VITE_HEIGHT: string;
    readonly VITE_CODE: string;
    readonly VITE_DESCRIPTION: string;
    readonly VITE_CID: string;
    readonly VITE_GID: string;
    readonly VITE_AUTH_BEARER: string;
    readonly VITE_ENDPOINT: string;
    readonly VITE_ENDPOINT_AUTH: string;
    readonly VITE_ENDPOINT_V: string;
    readonly VITE_ENDPOINT_V_RANK: string;
    readonly VITE_ENDPOINT_AGE: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
