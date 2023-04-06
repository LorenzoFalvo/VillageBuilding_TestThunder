import { Easing, Group, Loader, Point, Scene, Sprite, TweenAnimation} from "@gamindo/thunder";
import { Chair, Door } from "./MapObject";
import { Ground } from "./Ground";
// import { InteractiveObjects } from "./InteractiveObjects";

export enum LAYER {
    GROUND = 1,
    OBJECTS = 100,
    FRONT_DOOR = 200,
    BACK_DOOR = 1
}

export class Map extends Group{

    private currentMap: any;
    private allMaps: any;

    public gridArray: Ground[][] = [];
    private groundArray: Ground[] = [];
    private objectsArray: Sprite[] = [];
    // private doors: InteractiveObjects[] = [];


    constructor(scene: Scene, currentMap: string){
        super(scene);
        console.log("Create Map");
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
            
            case "floor1":
                currentMap = this.allMaps.maps.floor1;
                break;

            default:
                console.log("This map not exist: " + mapName);
        }

        return currentMap;
    }

    private createGround(): void{

        // const row: number = this.currentMap.row;
        // const col: number = this.currentMap.col;
        const groundArray: any[] = this.currentMap.grounds;
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
        this.createDoors();
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
        var newObject: any;

        for (let i = 0; i < groundSorted.length; i++) {
            switch(groundSorted[i].getFrame()){
                case 1:
                    newObject = new Sprite(this.scene, "buildings/IsoBarrel");
                    newObject.pivot.set(0.5, 0.81);
                    newObject.position.set(groundSorted[i].position.x, groundSorted[i].position.y);
                    this.objectsArray.push(newObject);
                    this.scene.add(newObject);
                    break;

                default:
                    console.log("Don't have frame!");
            }
        }
        this.sortObjects(this.objectsArray, LAYER.OBJECTS);
    }

    private createDoors(): void{
        // console.log("Doors" + this.currentMap.doors);
        const doorsArray = this.currentMap.doors;
        console.log("Doors" + doorsArray);
        var newObject: any;

        for (let i = 0; i < doorsArray.length; i++) {
            const row = doorsArray[i].row;
            const col = doorsArray[i].col;
            const frame = doorsArray[i].frame;
            const groundPos = this.gridArray[row][col];
            const goToMap = doorsArray[i].goToMap;

            console.log("Ground Pos" + groundPos);

            switch(frame){
                case 2:
                    newObject = new Door(this.scene, "buildings/doorLeft", groundPos, goToMap);
                    newObject.pivot.set(0.7, 0.96);
                    this.objectsArray.push(newObject);
                    this.scene.add(newObject);
                    this.scene.move(newObject, LAYER.BACK_DOOR);
                    break;

                case 3:
                    newObject = new Door(this.scene, "buildings/doorRight", groundPos, goToMap);
                    newObject.pivot.set(0.3, 0.96);
                    this.objectsArray.push(newObject);
                    this.scene.add(newObject);
                    this.scene.move(newObject, LAYER.BACK_DOOR);
                    break;

                case 4:
                    newObject = new Door(this.scene, "buildings/doorRight", groundPos, goToMap);
                    newObject.pivot.set(0.67, 0.73);
                    this.objectsArray.push(newObject);
                    this.scene.add(newObject);
                    this.scene.move(newObject, LAYER.FRONT_DOOR + newObject.position.y);
                    break;

                case 5:
                    newObject = new Door(this.scene, "buildings/doorLeft", groundPos, goToMap);
                    newObject.pivot.set(0.33, 0.73);
                    this.objectsArray.push(newObject);
                    this.scene.add(newObject);
                    this.scene.move(newObject, LAYER.FRONT_DOOR + newObject.position.y);
                    break;

                default:
                    console.log("Don't have frame!");
            }
        }
        // this.sortObjects(this.objectsArray, LAYER.OBJECTS);
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