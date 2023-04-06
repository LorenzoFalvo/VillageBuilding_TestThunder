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
        this.interactive = true;
        this.groundPos.walkable = true;

        this.position.set(this.groundPos.position.x, this.groundPos.position.y);
        scene.add(this);


        this.onPointerDown.subscribe(this.goToPoint, this);
    }
    // public abstract groundPos():Ground;

    public goToPoint(): string{

        // const ground = this.groundPos();
        console.log("From Abstract Class");
        // Door.action.invoke([this.groundPos.getRow(),this.groundPos.getCol(), this]);
        return "From Abstract Class";
    }
}


// class DoorCreator extends MapObject{
    
// }

// class ChairCreator extends MapObject{
    
// }

interface InteractiveObject{
    action(): void;

}

export class Door extends MapObject implements InteractiveObject{

    private nextMap: string = "";
    constructor(scene: Scene, frame: string, groundPos: Ground, nextMap: string){
        super(scene, frame, groundPos)

        this.nextMap = nextMap;
    }

    action(): void {
        // Door.action.invoke([this.nextMap]);
        
    }

    goToPoint(): string {
        console.log("From Door Concrete Class");
        Door.action.invoke([this.groundPos.getRow(), this.groundPos.getCol(), this.nextMap]);
        return "From Door Concrete Class";
    }
}

export class Chair extends MapObject implements InteractiveObject{

    
    action(): void {
        
    }

    goToPoint(): string {
        console.log("From Chair Concrete Class");
        Chair.action.invoke([this.groundPos.getRow(),this.groundPos.getCol()]);
        return "From Chair Concrete Class";
    }
}

