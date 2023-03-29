import { Scene, Sprite } from "@gamindo/thunder"


export class Ground extends Sprite{

    private startXPos: number = 100;
    private startYPos: number = 300;
    private xPos: number;
    private yPos: number;
    private row: number;
    private col: number;
    private frame: number;

    constructor(scene: Scene, frame: number, x: number, y: number, row: number, col: number){
        super(scene, "grounds/isocube");

        this.xPos = this.startXPos + (39 * col) + (38 * row);
        this.yPos = this.startYPos + (23 * row) - (22 * col);
        this.row = row;
        this.col = col;
        this.frame = frame;

        this.position.set(this.xPos, this.yPos);
        scene.add(this);
    }

    public getFrame(): number{
        return this.frame;
    }
}