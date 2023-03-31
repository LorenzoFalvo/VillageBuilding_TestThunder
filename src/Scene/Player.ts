import { Scene, ActionData, AnimatedSprite, Easing, ThunderMath} from "@gamindo/thunder"
import { Ground } from "./Ground";
import { LAYER } from "./Map";


export enum DIRECTION{
    DOWN_LEFT = "DownLeft",
    DOWN_RIGHT = "DownRight",
    UP_LEFT = "UpLeft",
    UP_RIGHT = "UpRight",
}

export class Player extends AnimatedSprite{


    public static action: ActionData = new ActionData();
    private walk_DownRight: string[] = ["player/player_DownRight0", "player/player_DownRight1", "player/player_DownRight2", "player/player_DownRight3"];
    private walk_UpRight: string[] = ["player/player_UpRight0", "player/player_UpRight1", "player/player_UpRight2", "player/player_UpRight3"];
    private walk_DownLeft: string[] = ["player/player_DownLeft0", "player/player_DownLeft1", "player/player_DownLeft2", "player/player_DownLeft3"];
    private walk_UpLeft: string[] = ["player/player_UpLeft0", "player/player_UpLeft1", "player/player_UpLeft2", "player/player_UpLeft3"];
    // private lastDir: DIRECTION = DIRECTION.DOWN_RIGHT;

    private currentAnim: string[] = [];

    private currentTargetData: any;
    private currentGridPos: Ground;

    constructor(scene: Scene, startGround: Ground){
        super(scene, ["player/player_DownRight0"]);

        this.pivot.set(0.5, 0.85);
        
        this.position.set(startGround.position.x, startGround.position.y);
        this.currentGridPos = startGround;
        scene.add(this);
        
        this.updateFrames({frames: this.walk_DownRight});
        this.fps = 10;
        this.isPaused = true;
        this.currentAnim = this.walk_DownRight;

        
        // this.interactive = true;

        // this.onPointerDown.subscribe(this.pointerDownLogic, this);
        
    }

    // public moveToNextPos(data: any): void{
        

    //     if(data!= this.currentTargetData){
    //         console.log("move player");

    //         this.currentTargetData = data;
    //         this.scene.tweenManager.cleanTarget(this.position);

    //         const a = this.position.x - data.x;
    //         const b = this.position.y - data.y;
    //         const distance = ThunderMath.sqrt(a * a + b * b);
    //         console.log("distance: " + distance);

    //         if(this.position.x < data.x){
    //             if(this.position.y < data.y){
    //                 this.updateFrames({frames: this.walk_DownRight});
    //                 this.currentAnim = this.walk_DownRight;
    //                 // this.lastDir = DIRECTION.DOWN_RIGHT;
    //             }else{
    //                 this.updateFrames({frames: this.walk_UpRight});
    //                 this.currentAnim = this.walk_UpRight;
    //                 // this.lastDir = DIRECTION.UP_RIGHT;
    //             }
    //         }else{
    //             if(this.position.y < data.y){
    //                 this.updateFrames({frames: this.walk_DownLeft});
    //                 this.currentAnim = this.walk_DownLeft;
    //                 // this.lastDir = DIRECTION.DOWN_LEFT;
    //             }else{
    //                 this.updateFrames({frames: this.walk_UpLeft});
    //                 this.currentAnim = this.walk_UpLeft;
    //                 // this.lastDir = DIRECTION.UP_LEFT;
    //             }
    //         }
            
            
    //         this.scene.tweenManager.add({
    //             target: this.position,
    //             duration: 5 * distance,
    //             ease: Easing.Linear,
    //             onStart: () => this.isPaused = false,
    //             onUpdate: () => this.checkZIndex(),
    //             onComplete: () => {
    //                 // this.updateFrames({frames: this.walk_DownRight});
    //                 this.updateFrames({frames: this.currentAnim});
    //                 this.isPaused = true;
    //             },
    //             options: {
    //                 x: data.x,
    //                 y: data.y,
    //             }
    //         }, true);
    //     }
    // }

    public moveToNextPos(data: Ground[]): void{
        
        for(let i = 0; i < data.length; i++){
            
            this.scene.tweenManager.add({
                target: this.position,
                duration: 1000,
                // delay: 1000 * i,
                ease: Easing.Linear,
                onStart: () => this.isPaused = false,
                onUpdate: () => this.checkZIndex(),
                onComplete: () => {
                    // this.updateFrames({frames: this.walk_DownRight});
                    this.updateFrames({frames: this.currentAnim});
                    this.isPaused = true;
                },
                options: {
                    x: data[i].position.x,
                    y: data[i].position.y,
                }
            }, true);

        }
    }

    private checkZIndex(){
        // console.log("Controllo profondità rispetto agli altri oggetti!");
        this.scene.move(this, LAYER.OBJECTS + this.position.y);

        // ThunderMath.overlapRectangles(this.wrappedBoundingBox, );
        this.scene.camera.moveTo(this.position.x, this.position.y);
    }

    public getCurrentGround(): Ground{
        return this.currentGridPos;
    }
}
