import { Command } from "../Command";
import { VideoCommands, VideoProvider } from "./VideoProvider";

export class OleVodVideoProvider extends VideoProvider {
    name: string = "OleVOD";

    get document(): Document {
        return top.document.querySelector<HTMLIFrameElement>("td#playleft iframe")!.contentDocument!;
    }

    get isReady(): boolean {
        if (this.document.readyState !== "complete")
            return false;

        if (!this.speedMenuItem)
            return false;

        return true;
    }

    get isPlayer(): boolean {
        return !!top.document.querySelector("td#playleft iframe");
    }

    get videoHolder(): HTMLVideoElement | null {
        return this.$("div.plyr video");
    }

    get overlayHolder(): HTMLDivElement | null {
        return this.$(".plyr__video-wrapper");
    }

    get playButton(): HTMLButtonElement | null {
        return this.$(".plyr__controls__item[data-plyr=play]");
    }

    get fullscreenButton(): HTMLButtonElement | null {
        return this.$(".plyr__controls__item[data-plyr=fullscreen]");
    }

    get speedMenuItem(): HTMLLIElement | null {
        return this.$("[data-plyr=speed][aria-checked=true]");
    }

    commands: VideoCommands = {
        play: this.playCommand(),

        speed: (up: boolean): Command => {
            let cmd = this.speedCommand(!up);
            return {
                enabled: true,
                call: () => {
                    if (!cmd.call())
                        return false;
                    let div = this.$<HTMLDivElement>(".plyr__menu__container div");
                    if (div) {
                        div.style.width = "";
                        div.style.height = "";
                    }
                    return true;
                },
                status: () => {
                    return parseFloat(this.speedMenuItem?.getAttribute("value") ?? "0");
                },
                message: () => {
                    return `${this.speedMenuItem?.getAttribute("value")}x`;
                },
            };
        },

        fullscreen: this.fullscreenCommand(),

        danmu: this.nullCommand(),

        mute: this.muteCommand(),

        volume: (delta: number): Command => this.volumeCommand(delta),

        skip: (delta: number): Command => this.skipCommand(delta),

        seek: (pos: number): Command => this.seekCommand(pos),
    };

    setup(keydownHandler: (event: KeyboardEvent) => void): void {
        // register keydown event handler
        top.document.body.onkeydown = keydownHandler;
        this.document.addEventListener("keydown", keydownHandler, true);

        // auto play video
        let video = this.videoHolder!;

        let playVideo = window.setInterval(() => {
            if (!video.paused) {
                window.clearInterval(playVideo);
                return;
            }
            this.commands.play.call();
        }, 300);
    }
}