import { Loader, Scene, Sprite } from "@gamindo/thunder";
import { Map } from "./Map";


export class Gameplay extends Scene {


    private background!: Sprite;
    private currentMap!: Map


    override init(args?: any): void {
        super.init(args);
    }

    override preLoad(): void {
        super.preLoad();

    }

    override create(): void {
        super.create();
        console.log("Call create super func");

        this.currentMap = new Map(this, "test");

        this.add(this.currentMap);

    }

    override shutdown(): void {
        super.shutdown();
    }

}