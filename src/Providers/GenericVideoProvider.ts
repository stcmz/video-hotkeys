import { Command } from "../Command";
import { VideoCommands, VideoProvider } from "./VideoProvider";

export class GenericVideoProvider extends VideoProvider {
    name: string = "Generic";
    hosts: string[] = ["*"];

    get document(): Document {
        if (top!.document.querySelector("video"))
            return top!.document;

        let iframes = top!.document.querySelectorAll("iframe");
        for (let i = 0; i < iframes.length; i++) {
            if (!iframes[i].contentDocument)
                continue;
            let video = iframes[i].contentDocument!.querySelector("video");
            if (video)
                return iframes[i].contentDocument!;
        }

        return null!;
    }

    get isReady(): boolean {
        if (this.document.readyState !== "complete")
            return false;

        return true;
    }

    get isPlayer(): boolean {
        return this.document != null;
    }

    get videoHolder(): HTMLVideoElement | null {
        return this.$("video");
    }

    get overlayHolder(): HTMLDivElement | null {
        return this.$("video")!.parentElement as HTMLDivElement;
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

    async getSpeed(): Promise<number | null> {
        if (this.invoker)
            return await this.invoker.speedStatus();
        return this.videoHolder?.playbackRate ?? null;
    }

    async setSpeedDelta(delta: number): Promise<void> {
        if (this.invoker)
            await this.invoker.speed(delta);
        else if (this.videoHolder)
            this.videoHolder.playbackRate += delta;
    }

    async toggleFullScreen(): Promise<void> {
        if (!this.document.fullscreenElement) {
            this.videoHolder?.parentElement?.requestFullscreen();
        } else {
            if (this.document.exitFullscreen) {
                this.document.exitFullscreen();
            }
        }
    }

    commands: VideoCommands = {
        play: this.playCommand(),

        speed: (up: boolean): Command => {
            return {
                enabled: true,
                call: async (): Promise<boolean> => {
                    let speed = await this.getSpeed();
                    if (!speed)
                        return false;

                    const brackets = [0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0];
                    let newspeed = speed;

                    if (up) {
                        for (let i of brackets)
                            if (i > speed) {
                                newspeed = i;
                                break;
                            }
                    }
                    else {
                        for (let i of brackets)
                            if (i < speed)
                                newspeed = i;
                            else
                                break;
                    }
                    this.setSpeedDelta(newspeed - speed);

                    return true;
                },
                status: async (): Promise<number> => {
                    return await this.getSpeed() ?? -1;
                },
                message: async (): Promise<string | null> => {
                    let speed = await this.getSpeed();
                    if (speed === null)
                        return null;
                    return `${speed}x`;
                },
            };
        },

        fullscreen: {
            enabled: true,
            call: async (): Promise<boolean> => {
                await this.toggleFullScreen();
                return true;
            },
            status: async (): Promise<boolean> => false,
            message: async (): Promise<null> => null,
        },

        theater: this.theaterCommand(),

        fullwebpage: this.fullwebpageCommand(),

        miniplayer: this.nullCommand(),

        danmu: this.nullCommand(),

        mute: this.muteCommand(),

        volume: (delta: number): Command => this.volumeCommand(delta),

        skip: (delta: number): Command => this.skipCommand(delta),

        seek: (pos: number): Command => this.seekCommand(pos),
    };

    async setup(keydownHandler: (event: KeyboardEvent) => void): Promise<void> {
        // register keydown event handler
        top!.document.body.addEventListener("keydown", ev => keydownHandler(ev), true);

        // prevent official keyup handler
        top!.document.body.addEventListener("keyup", ev => ev.stopPropagation(), true);
    }
}