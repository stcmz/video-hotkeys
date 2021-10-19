import { Command } from "../Command";
import { VideoCommands, VideoProvider } from "./VideoProvider";

export class OleVodVideoProvider extends VideoProvider {
    name: string = "OleVOD";

    get document(): Document {
        return top!.document.querySelector<HTMLIFrameElement>("td#playleft iframe")!.contentDocument!;
    }

    get isReady(): boolean {
        if (this.document.readyState !== "complete")
            return false;

        if (!this.speedMenuItem)
            return false;

        return true;
    }

    get isPlayer(): boolean {
        return !!top!.document.querySelector("td#playleft iframe");
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

    get theaterButton(): HTMLButtonElement | null {
        return null;
    }

    get fullwebpageButton(): HTMLButtonElement | null {
        return null;
    }

    get miniplayerButton(): HTMLButtonElement | null {
        return this.$(".plyr__controls__item[data-plyr=pip]");
    }

    get speedMenuItem(): HTMLLIElement | null {
        return this.$("[data-plyr=speed][aria-checked=true]");
    }

    commands: VideoCommands = {
        play: this.playCommandWithButton(),

        speed: (up: boolean): Command => {
            let cmd = this.speedCommand(!up);
            return {
                enabled: true,
                call: async (): Promise<boolean> => {
                    if (!cmd.call())
                        return false;
                    let div = this.$<HTMLDivElement>(".plyr__menu__container div");
                    if (div) {
                        div.style.width = "";
                        div.style.height = "";
                    }
                    return true;
                },
                status: async (): Promise<number> => {
                    return parseFloat(this.speedMenuItem?.getAttribute("value") ?? "0");
                },
                message: async (): Promise<string> => {
                    return `${this.speedMenuItem?.getAttribute("value")}x`;
                },
            };
        },

        fullscreen: this.fullscreenCommand(),

        theater: this.nullCommand(),

        fullwebpage: this.nullCommand(),

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
        this.document.addEventListener("keydown", keydownHandler, true);

        // auto play video
        let playVideo = window.setInterval(async () => {
            if (await this.commands.play.status()) {
                window.clearInterval(playVideo);
                return;
            }
            await this.commands.play.call();
        }, 300);
    }
}