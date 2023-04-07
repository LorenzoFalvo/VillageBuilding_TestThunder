import { ActionData, Scene, Sprite } from "@gamindo/thunder";
import { Ground } from "./Ground";


export abstract class MapObject extends Sprite{

    frame: string;
    groundPos: Ground;
    public static action: ActionData = new ActionData();

    constructor(scene: Scene, frame: string, groundPos: Ground){
        super(scene, frame);

        this.pivot.set(0.5, 0.25);
        
        this.frame = frame;
        this.groundPos = groundPos;
        // this.interactive = true;
        this.groundPos.walkable = true;

        this.position.set(this.groundPos.position.x, this.groundPos.position.y);
        scene.add(this);

        this.onPointerDown.subscribe(this.goToPoint, this);
    }

    public goToPoint(): void{
        // const ground = this.groundPos();
        console.log("From Abstract Class");
        // Door.action.invoke([this.groundPos.getRow(),this.groundPos.getCol(), this]);
        // return "From Abstract Class";
    }
}



