import { Scene, Sprite, PointerEvent, ActionData, BaseFilter} from "@gamindo/thunder"


export class Ground extends Sprite{

    private startXPos: number = 100;
    private startYPos: number = 400;
    public xPos: number;
    public yPos: number;
    private row: number;
    private col: number;
    private frame: number;
    private f: number;
    private g: number;
    private h: number;
    public neighbors: Ground[];
    public walkable: boolean;
    private parent?: Ground;

    public static action: ActionData = new ActionData();

    constructor(scene: Scene, frame: number, x: number, y: number, row: number, col: number){
        super(scene, "grounds/isocube");

        this.pivot.set(0.5, 0.25);
        this.xPos = this.startXPos + (39 * col) + (38 * row);
        this.yPos = this.startYPos + (23 * row) - (22 * col);
        this.row = row;
        this.col = col;
        this.frame = frame;
        this.f = 0;
        this.g = 0;
        this.h = 0;
        this.neighbors = [];

        if(frame == 0){
            this.interactive = true;
            this.walkable = true;
        }else{
            this.interactive = false;
            this.walkable = false;
        }

        this.position.set(this.xPos, this.yPos);
        scene.add(this);

        this.onPointerDown.subscribe(this.pointerDownLogic, this);
    }

    
    private pointerDownLogic(data: PointerEvent):void {
        
        // Ground.action.invoke([this.position]);
        Ground.action.invoke([this.row, this.col]);
    }

    public getFrame(): number{
        return this.frame;
    }

    public getRow(): number{
        return this.row;
    }
    public getCol(): number{
        return this.col;
    }
    public getParent(): Ground{
        return this.parent!;
    }
    public getF(): number{
        return this.f;
    }
    public getG(): number{
        return this.g;
    }
    public getH(): number{
        return this.h;
    }

    public setFrame(newTexture: string): void{
        this.texture = newTexture;
    }
    public setParent(newParent: Ground): void{
        this.parent = newParent;
    }
    public setF(newValue: number): void{
        this.f = newValue;
    }
    public setG(newValue: number): void{
        this.g = newValue;
    }
    public setH(newValue: number): void{
        this.h = newValue;
    }

    public updateNeighbors(grid: Ground[][]): Ground[] {

        this.neighbors = [];

        const { row, col } = this;
    
        if (row > 0) {
          if(grid[row - 1][col] != null && grid[row - 1][col].walkable) this.neighbors.push(grid[row - 1][col]);
        }
        if (row < grid.length - 1) {
            if(grid[row + 1][col] != null && grid[row + 1][col].walkable) this.neighbors.push(grid[row + 1][col]);
        }
        if (col > 0) {
            if(grid[row][col - 1] != null && grid[row][col - 1].walkable) this.neighbors.push(grid[row][col - 1]);
        }
        if (col < grid[row].length - 1) {
            if(grid[row][col + 1] != null && grid[row][col + 1].walkable) this.neighbors.push(grid[row][col + 1]);
        }

        return this.neighbors;
    }

    public resetVariable(): void{
        this.f = 0;
        this.g = 0;
        this.h = 0;
        this.neighbors = [];
        this.parent = undefined;

        this.setFrame("grounds/isocube");
    }
}