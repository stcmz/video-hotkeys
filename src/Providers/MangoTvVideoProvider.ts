import { Command } from "../Command";
import { VideoCommands, VideoProvider } from "./VideoProvider";

export class MangoTvVideoProvider extends VideoProvider {
    name: string = "MangoTV";
    hosts: string[] = ["w.mgtv.com"];

    get document(): Document {
        return top!.document;
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

    get theaterButton(): HTMLButtonElement | null {
        return null;
    }

    get fullwebpageButton(): HTMLButtonElement | null {
        return this.$("mango-webscreen.control-item");
    }

    get miniplayerButton(): HTMLButtonElement | null {
        return this.$("mango-control-pip.control-item");
    }

    get speedMenuItem(): HTMLLIElement | null {
        return this.$("mango-playrate a.focus");
    }

    private get speedTips(): HTMLDivElement | null {
        return this.$(".control-tips-pop");
    }

    commands: VideoCommands = {
        play: this.playCommand(),

        speed: (up: boolean): Command => this.speedCommand(up),

        fullscreen: this.fullscreenCommand(),

        theater: this.nullCommand(),

        fullwebpage: this.fullwebpageCommand(),

        miniplayer: this.miniplayerCommand(),

        danmu: this.nullCommand(),

        mute: this.muteCommand(),

        volume: (delta: number): Command => this.volumeCommand(delta),

        skip: (delta: number): Command => this.skipCommand(delta),

        seek: (pos: number): Command => this.seekCommand(pos),
    };

    async setup(keydownHandler: (event: KeyboardEvent) => void): Promise<void> {
        // register keydown event handler
        top!.document.body.onkeydown = keydownHandler;

        // remove default speed tips
        this.speedTips!.style.visibility = "hidden";
    }
}