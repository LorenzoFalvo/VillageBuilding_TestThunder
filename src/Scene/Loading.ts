import { AnimationTrack, BaseGraphic, BitmapText, Scene } from "@gamindo/thunder";

export class Loading extends Scene {
    private logoCompleted: boolean = false;
    private loadingComplete: boolean = false;

    override preLoad(): void {
        super.preLoad();

        this.loader.addAsset("firacode", "fonts/firacode.fnt");
    }

    override create() {
        super.create();

        // TODO: Load base assets
        this.loader.onComplete.subscribe(this.loadAssets, this);
    }

    private async loadAssets() {
        // TODO: Load all assets here
        this.loader.onComplete.clear();
        this.loader.onComplete.subscribe(this.toNextRoom, this);

        await this.introLogo();
    }

    private async introLogo(): Promise<void> {
        return new Promise<void>((res, rej) => {
            const logo = new BaseGraphic(this);
            logo.position.set(360, 640);

            logo.beginDraw(0x2d4263, false);
            logo.drawRect(0, 0, 150, 100, true);
            logo.endDraw();

            this.add(logo);

            const gamindo = new BitmapText(this, { fontName: "firacode", fontSize: 64 });
            gamindo.text = "GAMINDO";
            gamindo.pivot.set(0.5, 0.5);
            gamindo.position.set(logo.position.x, logo.position.y + logo.height * 0.5 + 64);
            this.add(gamindo);

            const timeline = new AnimationTrack(this);

            timeline.addTrack(logo, "alpha");
            timeline.addKey("alpha", "alpha", { time: 0, value: 0 });
            timeline.addKey("alpha", "alpha", { time: 500, value: 1 });
            timeline.addKey("alpha", "alpha", { time: 2500, value: 1 });
            timeline.addKey("alpha", "alpha", { time: 2750, value: 0 });

            timeline.addTrack(gamindo, "introGamindo");
            timeline.addKey("introGamindo", "alpha", { time: 0, value: 0 });
            timeline.addKey("introGamindo", "position.y", { time: 0, value: gamindo.position.y - 64 });
            timeline.addKey("introGamindo", "alpha", { time: 100, value: 0 });
            timeline.addKey("introGamindo", "alpha", { time: 600, value: 1 });
            timeline.addKey("introGamindo", "position.y", { time: 600, value: gamindo.position.y });
            timeline.addKey("introGamindo", "alpha", { time: 2600, value: 1 });
            timeline.addKey("introGamindo", "alpha", { time: 2850, value: 0 });

            timeline.start();

            timeline.onComplete.subscribe(() => {
                this.logoCompleted = true;

                // Load next room if loading is completed
                if (this.loadingComplete) {
                    this.toNextRoom();
                }

                // Move to loading animation if we are still loading
                else {
                    this.loadingAnimation();
                }

                res();
            });
        });
    }

    private loadingAnimation() {
        // TODO: Create loading animation here
    }

    private toNextRoom(): void {
        this.loadingComplete = true;

        if (this.logoCompleted) {
            // TODO: Move to next scene
        }
    }
}
