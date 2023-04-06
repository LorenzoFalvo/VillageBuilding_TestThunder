import { Scene, ActionData, AnimatedSprite, Easing, ThunderMath, Game} from "@gamindo/thunder"
import { GameManager } from "./GameManager";
import { Ground } from "./Ground";
// import { InteractiveObjects } from "./InteractiveObjects";
import { LAYER } from "./Map";
import { MapObject } from "./MapObject";


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
    private currentGridPos: any;
    public currentRow: number;
    public currentCol: number;
    private gameManager?: GameManager;

    constructor(scene: Scene, startGround: Ground, gameManager: GameManager){
        super(scene, ["player/player_DownRight0"]);

        this.pivot.set(0.5, 0.85);
        
        this.position.set(startGround.position.x, startGround.position.y);
        this.currentGridPos = startGround;
        this.currentRow = startGround.getRow();
        this.currentCol = startGround.getCol();
        scene.add(this);
        
        this.updateFrames({frames: this.walk_DownRight});
        this.fps = 10;
        this.isPaused = true;
        this.currentAnim = this.walk_DownRight;


        this.gameManager = gameManager;
        console.log("GameManager -> "+ this.gameManager);

        
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

    public moveToNextPos(index: number, data: Ground[], changeMap?: boolean): void{
        this.scene.tweenManager.cleanTarget(this.position);

        this.scene.tweenManager.add({
            target: this.position,
            duration: 250,
            // delay: 1000 * index,
            ease: Easing.Linear,
            onStart: () => {
                this.modifyCurrentAnim(data[index].position.x, data[index].position.y);
                this.isPaused = false;
                },
            onUpdate: () => this.checkZIndex(),
            onComplete: () => {
                // this.updateFrames({frames: this.walk_DownRight});
                // this.currentGridPos = data[i];
                data[index].setFrame("grounds/isocube");

                if(index < data.length-1){
                    // console.log("Move to next Pos: " + index++);
                    index++;
                    this.moveToNextPos(index, data, changeMap);
                    this.currentRow = data[index-1].getRow();
                    this.currentCol = data[index-1].getCol();

                    this.currentGridPos = data[index-1];
                    // console.log(this.currentGridPos);
                }else{
                    console.log("Ultima posizione raggiunta!");
                    console.log("Change map? ->" + changeMap);
                    if(changeMap){
                        console.log("Eseguo azione dell'oggetto cliccato!");
                        this.gameManager?.ChangeMap();
                    } 
                }
                

                this.updateFrames({frames: this.currentAnim});
                this.isPaused = true;
            },
            options: {
                x: data[index].position.x,
                y: data[index].position.y,
            }
        }, true);

    }
    
    private modifyCurrentAnim(NextPosX:number, NextPosY:number): void{
        if(this.position.x < NextPosX){
            if(this.position.y < NextPosY){
                this.updateFrames({frames: this.walk_DownRight});
                this.currentAnim = this.walk_DownRight;
                // this.lastDir = DIRECTION.DOWN_RIGHT;
            }else{
                this.updateFrames({frames: this.walk_UpRight});
                this.currentAnim = this.walk_UpRight;
                // this.lastDir = DIRECTION.UP_RIGHT;
            }
        }else{
            if(this.position.y < NextPosY){
                this.updateFrames({frames: this.walk_DownLeft});
                this.currentAnim = this.walk_DownLeft;
                // this.lastDir = DIRECTION.DOWN_LEFT;
            }else{
                this.updateFrames({frames: this.walk_UpLeft});
                this.currentAnim = this.walk_UpLeft;
                // this.lastDir = DIRECTION.UP_LEFT;
            }
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

    public setCurrentGround(ground: Ground): void{
        this.currentGridPos = ground;
        this.position.set(ground.position.x, ground.position.y);
    }
}
