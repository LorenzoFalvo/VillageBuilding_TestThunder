import { Scene } from "@gamindo/thunder";
import { Ground } from "./Ground";
import { InteractiveObject } from "./InteractiveObject";
import { MapObject } from "./MapObject";

export class Door extends MapObject implements InteractiveObject{

    private nextMap: string = "";
    private nextGroundPos: number;
    private unlocked: boolean = false;
    constructor(scene: Scene, frame: string, groundPos: Ground, nextMap: string, nextGroundPos: number, unlocked: boolean){
        super(scene, frame, groundPos)

        this.nextMap = nextMap;
        this.nextGroundPos = nextGroundPos;
        this.unlocked = unlocked;
    }

    action(): void {
        // Door.action.invoke([this.nextMap]);

    }

    goToPoint(): void {
        console.log("From Door Concrete Class, To next map-> " + this.nextMap);
        Door.action.invoke([this.groundPos.getRow(), this.groundPos.getCol(), this]);
        // return "From Door Concrete Class";
    }

    public getGroundPos(): Ground{
        return this.groundPos;
    }
    public getNextGroundPos(): number{
        return this.nextGroundPos;
    }
    public getNextMap(): string{
        return this.nextMap;
    }
    public isUnlocked(): boolean{
        return this.unlocked;
    }
}