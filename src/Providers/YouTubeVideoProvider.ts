import { Command } from "../Command";
import { VideoCommands, VideoProvider } from "./VideoProvider";

export class YouTubeVideoProvider extends VideoProvider {
    name: string = "YouTube";
    hosts: string[] = ["www.youtube.com"];

    get document(): Document {
        return top!.document;
    }

    get isReady(): boolean {
        if (top!.document.readyState !== "complete")
            return false;

        return true;
    }

    get isPlayer(): boolean {
        return !!this.$("video");
    }

    get videoHolder(): HTMLVideoElement | null {
        return this.$("video");
    }

    get overlayHolder(): HTMLDivElement | null {
        return this.$("video")?.parentElement as HTMLDivElement;
    }

    get playButton(): HTMLButtonElement | null {
        return null;
    }

    get fullscreenButton(): HTMLButtonElement | null {
        return null;
    }

    get theaterButton(): HTMLButtonElement | null {
        return null;
    }

    get fullwebpageButton(): HTMLButtonElement | null {
        return null;
    }

    get miniplayerButton(): HTMLButtonElement | null {
        return null;
    }

    get speedMenuItem(): HTMLLIElement | null {
        return null;
    }

    commands: VideoCommands = {
        play: this.nullCommand(),

        speed: (_: boolean): Command => this.nullCommand(),

        fullscreen: this.nullCommand(),

        theater: this.nullCommand(),

        fullwebpage: this.nullCommand(),

        miniplayer: this.nullCommand(),

        danmu: this.nullCommand(),

        mute: this.nullCommand(),

        volume: (_: number): Command => this.nullCommand(),

        skip: (delta: number): Command => this.skipCommand(delta),

        seek: (_: number): Command => this.nullCommand(),
    };

    async setup(keydownHandler: (event: KeyboardEvent) => void): Promise<void> {
        // register keydown event handler
        top!.document.body.addEventListener("keydown", keydownHandler);
    }
}