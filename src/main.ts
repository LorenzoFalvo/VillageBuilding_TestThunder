import { Game, Log, RESIZE_MODE } from "@gamindo/thunder";
import { Loading } from "./Scene/Loading";
import "./style.css";

window.onload = async (): Promise<void> => {
    Log.log(`${import.meta.env.VITE_NAME} V${import.meta.env.VITE_VERSION}`);
    Log.enableConsole = import.meta.env.DEV;

    const app = new Game({
        antialias: false,
        resizeMode: RESIZE_MODE.FIT,
        gameWidth: parseInt(import.meta.env.VITE_WIDTH),
        gameHeight: parseInt(import.meta.env.VITE_HEIGHT),
    });
    app.color = 0x191919;

    app.sceneManager.add(new Loading({ game: app, key: "Loading", resizeMode: RESIZE_MODE.FIT }));
    app.sceneManager.start("Loading");

    document.body.appendChild(app.view());
};
