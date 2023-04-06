import { Easing, FadeManager, Scene, ThunderMath} from "@gamindo/thunder";
import { AStar } from "./AStar";
import { MapObject } from "./MapObject";
import { Ground } from "./Ground";
// import { InteractiveObjects } from "./InteractiveObjects";
import { LAYER, Map } from "./Map";
import { Player } from "./Player";



export class GameManager extends Scene {


    // private background!: Sprite;
    private currentMap!: Map;
    private player!: Player;
    // private chooseActionCallback: (data: any[])=>void = (data)=>{this.player.moveToNextPos(data[0]);};
    private ground_ActionCallback: (data: any[])=>void = (data)=>{this.AStarTest(data);};
    private MapObject_ActionCallback: (data: any[])=>void = (data)=>{this.ChangeMap(data[0]);};
    


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
        this.spawnPlayer();

        this.add(this.currentMap);

        this.interactive = true;
        // this.onPointerDown.subscribe(this.pointerDownLogic, this);

        Ground.action.subscribe(this.ground_ActionCallback, this);
        MapObject.action.subscribe(this.MapObject_ActionCallback, this);

    }

    override shutdown(): void {
        super.shutdown();

        Ground.action.unsubscribe(this.ground_ActionCallback, this);
        MapObject.action.unsubscribe(this.MapObject_ActionCallback, this);


    }

    // private pointerDownLogic(data: PointerEvent):void {

    //     console.log(data);

    //     // this.movePlayer(data.position.x, data.position.y);
    // }

    protected ChangeMap(newMap: string){
        
        this.currentMap.interactive = false;
        // this.currentMap.removeObjects();

        this.tweenManager.add({
            target: this,
            duration: 500,
            ease: Easing.Linear,
            onComplete: () => {
                
                console.log("NewMap -> " + newMap);
                const fadeManager = new FadeManager();
                // fadeManager.fadeOut(this, 500, false);
                this.currentMap.removeObjects();
                this.remove(this.currentMap);
                

                this.currentMap = new Map(this, newMap);
                this.add(this.currentMap);

                this.player.setCurrentGround(this.currentMap.getGroundArray()[0]);
                fadeManager.fadeIn(this, 1000);
                // this.destroy();
            },
            options: {
                alpha: 0, 
            }
        }, true);
    }

    private AStarTest(data: any[]){
        console.log("TEST ASTART PATHFINDING");
        
        // console.log("DATA: " + data[0] + " , " + data[1]);
        // console.log(this.currentMap.gridArray[data[0]][data[1]]);
        // console.log(this.currentMap.gridArray[data[0]][data[1]].getGroundInfo());

        const ground = this.currentMap.getGroundArray();
        // for(let i = 0; i < ground.length; i++){
        //     ground[i].setFrame("grounds/isocube");
        // }
        // console.log( "Player Row & Col: " + this.player.currentRow + " , " + this.player.currentCol);
        const grid: Ground[][] = this.currentMap.gridArray;
        // console.log("Grid Array: " + grid);
        const startNode = this.player.getCurrentGround();
        const endNode: Ground = grid[data[0]][data[1]];

        if(grid[data[0]][data[1]] != startNode){

            for(let i = 0; i < ground.length; i++){
                ground[i].resetVariable();
            }
            const astar = new AStar(grid, startNode, endNode);
            const path = astar.findPath();

            astar.shutdown();
            
            for(let i = 1; i < path.length; i++){
                path[i].setFrame("grounds/isocube_green");
            }
            // console.log(path);
            
            this.player.moveToNextPos(1, path);
            
        }else{
            // console.log("Is the same position");
        }

        
    }

    private spawnPlayer(): void{
        // const randomGround: Ground = ThunderMath.randomChoice(this.groundArray);

        this.player = new Player(this, this.currentMap.getGroundArray()[0]);

        console.log(this.player.position.x + " , " + this.player.position.y);
        this.move(this.player, LAYER.OBJECTS + this.player.position.y);

        this.camera.moveTo(this.player.position.x, this.player.position.y);
    }

}