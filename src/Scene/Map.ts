import { Group, Loader, Scene, Sprite} from "@gamindo/thunder";
import { Ground } from "./Ground";
import { Player } from "./Player";

export enum Layers {
    GROUND = 1,
    OBJECTS = 100,
}

export class Map extends Group{

    private currentMap: any;
    private allMaps: any;
    private groundArray: Ground[] = [];
    private objectsArray: Sprite[] = [];
    private player!: Player;

    constructor(scene: Scene, currentMap: string){
        super(scene);
        console.log("Create Map");

        const mapsJsonString = JSON.stringify(Loader.getJson("mapsJson"));
        this.allMaps = JSON.parse(mapsJsonString);
        
        this.currentMap = this.GetCurrentMap();
        this.CreateGround();

        // this.interactive = true;
        // this.onPointerDown.subscribe(this.pointerDownLogic, this);

    }

    // private pointerDownLogic(data: PointerEvent):void {

    //     console.log(this.position.x, this.position.y);

    //     // this.movePlayer(data.position.x, data.position.y);
    // }

    private GetCurrentMap(): any{
        const currentMap = this.allMaps.maps.test;
        return currentMap;
    }

    private CreateGround(): void{

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
                this.groundArray.push(groundPiece);
            }else{
                // console.log("Buco nel pavimento");
            }
        }
        this.SortObject(this.groundArray, Layers.GROUND);
        this.CreateObjects();
        this.SpawnPlayer();
    }

    private CreateObjects(): void{

        for (let i = 0; i < this.groundArray.length; i++) {
            if(this.groundArray[i].getFrame() == 1){
                const barileObj: Sprite = new Sprite(this.scene, "buildings/IsoBarrel");
                barileObj.pivot.set(0.5, 0.81);
                barileObj.position.set(this.groundArray[i].position.x, this.groundArray[i].position.y);
                this.scene.add(barileObj);

                this.objectsArray.push(barileObj);
            }
        }
        this.SortObject(this.objectsArray, Layers.OBJECTS);
    }
    private SortObject(arrayObj: any[], zOffset: number): void{

        const cloneArray: any[] = [...arrayObj];
        cloneArray.sort((a, b) => a.position.y - b.position.y);

        for (let i = 0; i < arrayObj.length; i++) {
            this.scene.move(arrayObj[i], zOffset + arrayObj[i].position.y);
        }
    }

    private SpawnPlayer(): void{
        // const randomGround: Ground = ThunderMath.randomChoice(this.groundArray);

        this.player = new Player(this.scene, this.groundArray[0].position.x, this.groundArray[0].position.y);

        console.log(this.player.position.x + " , " + this.player.position.y);
        this.scene.move(this.player, Layers.OBJECTS + this.player.position.y);

        this.scene.camera.moveTo(this.player.position.x, this.player.position.y);
    }

    public getPlayer(): Player{
        return this.player;
    }
}