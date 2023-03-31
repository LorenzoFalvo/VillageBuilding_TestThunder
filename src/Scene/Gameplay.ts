import { Scene, ThunderMath} from "@gamindo/thunder";
import { AStar } from "./AStar";
import { Ground } from "./Ground";
import { Map } from "./Map";
import { Player } from "./Player";



export class Gameplay extends Scene {


    // private background!: Sprite;
    private currentMap!: Map;
    private player!: Player;
    // private chooseActionCallback: (data: any[])=>void = (data)=>{this.player.moveToNextPos(data[0]);};
    private chooseActionCallback: (data: any[])=>void = (data)=>{this.AStarTest(data);};


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

    
    private AStarTest(data: any[]){
        console.log("TEST ASTART PATHFINDING");
        
        console.log("DATA: " + data[0] + " , " + data[1]);
        console.log(this.currentMap.gridArray[data[0]][data[1]]);
        // console.log(this.currentMap.gridArray[data[0]][data[1]].getGroundInfo());

        const ground = this.currentMap.getGroundArray();
        for(let i = 0; i < ground.length; i++){
            ground[i].setFrame("grounds/isocube");
        }

        const grid: Ground[][] = this.currentMap.gridArray;
        const startNode = this.player.getCurrentGround();
        const endNode: Ground = this.currentMap.gridArray[data[0]][data[1]];
        const astar = new AStar(grid, startNode, endNode);
        const path = astar.findPath();

        for(let i = 0; i < path.length; i++){
            path[i].setFrame("grounds/isocube_green");
        }
        console.log(path);
        
        this.player.moveToNextPos(path)
    }

}