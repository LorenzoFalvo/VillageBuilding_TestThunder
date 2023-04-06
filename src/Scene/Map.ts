import { Easing, Group, Loader, Point, Scene, Sprite, TweenAnimation} from "@gamindo/thunder";
import { Chair, Door } from "./MapObject";
import { Ground } from "./Ground";
// import { InteractiveObjects } from "./InteractiveObjects";

export enum LAYER {
    GROUND = 1,
    OBJECTS = 100,
    DOOR = 1,
}

export class Map extends Group{

    private currentMap: any;
    private allMaps: any;
    private gameplayScene: Scene;

    public gridArray: Ground[][] = [];
    private groundArray: Ground[] = [];
    private objectsArray: Sprite[] = [];
    // private doors: InteractiveObjects[] = [];


    constructor(scene: Scene, currentMap: string){
        super(scene);
        console.log("Create Map");
        this.gameplayScene = scene;
        const mapsJsonString = JSON.stringify(Loader.getJson("mapsJson"));
        this.allMaps = JSON.parse(mapsJsonString);
        
        this.currentMap = this.getCurrentMap(currentMap);
        this.createGround();

        // this.interactive = true;
        // this.onPointerDown.subscribe(this.pointerDownLogic, this);
    }

    
    // private pointerDownLogic(data: PointerEvent):void {

    //     console.log(this.position.x, this.position.y);

    //     // this.movePlayer(data.position.x, data.position.y);
    // }

    private getCurrentMap(mapName: string): any{

        var currentMap: any;

        switch(mapName){
            case "test":
                currentMap = this.allMaps.maps.test;
                break;

            case "secondTest":
                currentMap = this.allMaps.maps.secondTest;
                break;

            default:
                console.log("This map not exist: " + mapName);
        }

        return currentMap;
    }

    private createGround(): void{

        // const row: number = this.currentMap.row;
        // const col: number = this.currentMap.col;
        const groundArray: any[] = this.currentMap.assets;
        // groundArray.sort((a, b) => a.y - b.y);


        for (let x= 0; x < groundArray.length; x++) {
            if(groundArray[x].frame != null){
                const obj_frame = groundArray[x].frame;
                const obj_xPos = groundArray[x].x;
                const obj_yPos = groundArray[x].y;
                const obj_row = groundArray[x].row;
                const obj_col = groundArray[x].col;

                const groundPiece: Ground = new Ground(this.scene, obj_frame, obj_xPos, obj_yPos, obj_row, obj_col);
                // this.add(groundPiece);
                this.groundArray.push(groundPiece);
            }else{
                // console.log("Buco nel pavimento");
            }
        }

        for (let x = 0; x < this.currentMap.row; x++) {
            this.gridArray[x] = [];
            for(let y = 0; y < this.currentMap.col; y++){

                const currentGround = this.findCorrectGround(x, y);

                if(currentGround != null){
                    this.gridArray[x][y] = currentGround;
                }
        
            }
        }

        console.log(this.gridArray);

        this.sortGrid(this.groundArray);
        this.createObjects();
    }

    private findCorrectGround(row:number, col:number): any{
        const groundArray: any[] = this.groundArray;
        var correctGround: any;

        for (let i= 0; i < groundArray.length; i++) {
            if(groundArray[i].getFrame() != null){
                if(groundArray[i].getRow() == row && groundArray[i].getCol() == col){
                    correctGround = groundArray[i];
                    break;
                }
            }
        }
        return correctGround;
    }

    private createObjects(): void{

        const groundSorted = this.returnArraySorted(this.groundArray);

        for (let i = 0; i < groundSorted.length; i++) {
            if(groundSorted[i].getFrame() == 1){
                const barileObj: Sprite = new Sprite(this.scene, "buildings/IsoBarrel");
                barileObj.pivot.set(0.5, 0.81);
                barileObj.position.set(groundSorted[i].position.x, groundSorted[i].position.y);
                this.scene.add(barileObj);
                // this.objectsArray.push(barileObj);

                this.objectsArray.push(barileObj);
            }else if(this.groundArray[i].getFrame() == 2){
                // const doorObj: InteractiveObjects = new InteractiveObjects(this.scene, "buildings/doorLeft", this.groundArray[i]);
                // doorObj.pivot.set(0.7, 0.96);
                // this.scene.add(doorObj);

                const doorObj: Door = new Door(this.scene, "buildings/doorLeft", this.groundArray[i]);
                doorObj.pivot.set(0.7, 0.96);
                this.objectsArray.push(doorObj);
                this.scene.add(doorObj);

                // const barileObj: Chair = new Chair(this.scene, "buildings/IsoBarrel", this.groundArray[i]);
                // barileObj.pivot.set(0.7, 0.96);
                // barileObj.position.set(barileObj.position.x + 50, barileObj.position.y + 100);
                // this.scene.add(barileObj);
            }
        }
        this.sortObjects(this.objectsArray, LAYER.OBJECTS);
    }

    private sortObjects(arrayObj: any[], zOffset: number): void{

        const cloneArray = this.returnArraySorted(arrayObj);

        for (let i = 0; i < cloneArray.length; i++) {
            
            this.scene.move(cloneArray[i], zOffset + cloneArray[i].position.y);
            // this.add(cloneArray[i]);
        }
    }
    
    private sortGrid(arrayObj: any[]): void{

        const cloneArray = this.returnArraySorted(arrayObj);

        for (let i = 0; i < cloneArray.length; i++) {
            
            this.add(cloneArray[i]);
        }
    }

    
    private returnArraySorted(arrayObj: any[]): any[]{

        const cloneArray: any[] = [...arrayObj];
        cloneArray.sort((a, b) => a.position.y - b.position.y);

        return cloneArray;
    }

    public getGroundArray(): Ground[]{

        return this.groundArray;
    }

    public removeObjects(): void{
        
        for(let i = 0; i < this.objectsArray.length; i++){
            this.scene.remove(this.objectsArray[i]);
        }
        // for(let i = 0; i < this.objectsArray.length; i++){
        //     this.scene.tweenManager.add({
        //         target:this.objectsArray[i],
        //         duration: 500,
        //         onComplete: () => this.scene.remove(this.objectsArray[i]),
        //         options:{alpha: 0}
        //     }, true);
        // }

        
    }
}