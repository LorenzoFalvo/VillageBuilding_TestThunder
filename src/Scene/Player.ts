import { Scene, ActionData, AnimatedSprite, Easing, ThunderMath} from "@gamindo/thunder"
import { Ground } from "./Ground";
import { Layers } from "./Map";




export class Player extends AnimatedSprite{


    public static action: ActionData = new ActionData();
    private walk_DownRight: string[] = ["player/player_DownRight0", "player/player_DownRight1", "player/player_DownRight2", "player/player_DownRight3"];
    private walk_UpRight: string[] = ["player/player_UpRight0", "player/player_UpRight1", "player/player_UpRight2", "player/player_UpRight3"];
    private walk_DownLeft: string[] = ["player/player_DownLeft0", "player/player_DownLeft1", "player/player_DownLeft2", "player/player_DownLeft3"];
    private walk_UpLeft: string[] = ["player/player_UpLeft0", "player/player_UpLeft1", "player/player_UpLeft2", "player/player_UpLeft3"];



    constructor(scene: Scene, x: number, y: number){
        super(scene, ["player/player_DownRight0"]);

        this.pivot.set(0.5, 0.85);
        
        this.position.set(x, y);
        scene.add(this);
        
        this.updateFrames({frames: this.walk_DownRight});
        this.fps = 10;
        this.isPaused = true;

        
        // this.interactive = true;

        // this.onPointerDown.subscribe(this.pointerDownLogic, this);
        
    }

    public moveToNextPos(data: any): void{

        console.log("move player");

        this.scene.tweenManager.cleanTarget(this.position);

        if(this.position.x < data.x){
            if(this.position.y < data.y){
                this.updateFrames({frames: this.walk_DownRight});
            }else{
                this.updateFrames({frames: this.walk_UpRight});
            }
        }else{
            if(this.position.y < data.y){
                this.updateFrames({frames: this.walk_DownLeft});
            }else{
                this.updateFrames({frames: this.walk_UpLeft});
            }
        }

        this.scene.tweenManager.add({
            target: this.position,
            duration: 1000,
            ease: Easing.Linear,
            onStart: () => this.isPaused = false,
            onUpdate: () => this.checkZIndex(),
            onComplete: () => {
                this.updateFrames({frames: this.walk_DownRight});
                this.isPaused = true;
            },
            options: {
                x: data.x,
                y: data.y,
            }
        }, true);

        
    }

    private checkZIndex(){
        // console.log("Controllo profondità rispetto agli altri oggetti!");
        this.scene.move(this, Layers.OBJECTS + this.position.y);

        // ThunderMath.overlapRectangles(this.wrappedBoundingBox, );
        this.scene.camera.moveTo(this.position.x, this.position.y);
    }
}
