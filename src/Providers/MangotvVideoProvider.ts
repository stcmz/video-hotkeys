import { VideoProvider } from "./VideoProvider";

export class MangotvVideoProvider extends VideoProvider {
    name: string = "MangoTV";

    get document(): Document {
        return top.document;
    }

    get isReady(): boolean {
        if (this.document.readyState !== "complete")
            return false;

        if (!this.speedTips)
            return false;

        return true;
    }

    get isPlayer(): boolean {
        return !!this.$("#mgtv-player-wrap");
    }

    get videoHolder(): HTMLVideoElement | null {
        return this.$("#mgtv-player-wrap video");
    }

    get overlayHolder(): HTMLDivElement | null {
        return this.$("#mgtv-player-wrap container");
    }

    get playButton(): HTMLButtonElement | null {
        return this.$(".btn-play");
    }

    get fullscreenButton(): HTMLButtonElement | null {
        return this.$("mango-screen.control-item");
    }

    get speedMenuItem(): HTMLLIElement | null {
        return this.$("mango-playrate a.focus");
    }

    private get speedTips(): HTMLDivElement | null {
        return this.$(".control-tips-pop");
    }

    setup(keydownHandler: (event: KeyboardEvent) => void): void {
        // register keydown event handler
        top.document.body.onkeydown = keydownHandler;

        // remove default speed tips
        this.speedTips!.style.visibility = "hidden";
    }
}