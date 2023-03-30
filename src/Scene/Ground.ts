import { Scene, Sprite, PointerEvent, ActionData} from "@gamindo/thunder"


export class Ground extends Sprite{

    private startXPos: number = 100;
    private startYPos: number = 400;
    private xPos: number;
    private yPos: number;
    private row: number;
    private col: number;
    private frame: number;

    public static action: ActionData = new ActionData();

    constructor(scene: Scene, frame: number, x: number, y: number, row: number, col: number){
        super(scene, "grounds/isocube");

        this.pivot.set(0.5, 0.25);
        this.xPos = this.startXPos + (39 * col) + (38 * row);
        this.yPos = this.startYPos + (23 * row) - (22 * col);
        this.row = row;
        this.col = col;
        this.frame = frame;

        if(frame == 0){
            this.interactive = true;
        }else{
            this.interactive = false;
        }

        this.position.set(this.xPos, this.yPos);
        scene.add(this);

        this.onPointerDown.subscribe(this.pointerDownLogic, this);
        
    }

    public getFrame(): number{
        return this.frame;
    }

    private pointerDownLogic(data: PointerEvent):void {

        // console.log(this.position.x, this.position.y);

        Ground.action.invoke([this.position]);

        // this.movePlayer(data.position.x, data.position.y);
    }
}