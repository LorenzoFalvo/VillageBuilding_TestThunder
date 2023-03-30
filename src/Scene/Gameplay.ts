import { Scene} from "@gamindo/thunder";
import { Ground } from "./Ground";
import { Map } from "./Map";
import { Player } from "./Player";


export class Gameplay extends Scene {


    // private background!: Sprite;
    private currentMap!: Map;
    private player!: Player;
    private chooseActionCallback: (data: any[])=>void = (data)=>{this.player.moveToNextPos(data[0]);};


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
        this.player = this.currentMap.getPlayer();

        this.interactive = true;
        // this.onPointerDown.subscribe(this.pointerDownLogic, this);

        Ground.action.subscribe(this.chooseActionCallback, this);

    }

    override shutdown(): void {
        super.shutdown();

        Ground.action.unsubscribe(this.chooseActionCallback, this);

    }

    // private pointerDownLogic(data: PointerEvent):void {

    //     console.log(data);

    //     // this.movePlayer(data.position.x, data.position.y);
    // }

    


}