import { Command } from "../Command";
import { Invoker } from "../Communication/ExtensionSide";
import { Overlay } from "../Overlay";

export interface VideoCommands {
    play: Command;
    speed(up: boolean): Command;

    fullscreen: Command;
    theater: Command;
    fullwebpage: Command;
    miniplayer: Command;
    danmu: Command;

    mute: Command;
    volume(delta: number): Command;

    skip(delta: number): Command;
    seek(pos: number): Command;
}

export abstract class VideoProvider {
    abstract name: string;
    abstract hosts: string[];
    abstract document: Document;

    abstract isReady: boolean;
    abstract isPlayer: boolean;

    abstract videoHolder: HTMLVideoElement | null;
    abstract overlayHolder: HTMLDivElement | null;

    abstract playButton: HTMLButtonElement | null;
    abstract fullscreenButton: HTMLButtonElement | null;
    abstract theaterButton: HTMLButtonElement | null;
    abstract fullwebpageButton: HTMLButtonElement | null;
    abstract miniplayerButton: HTMLButtonElement | null;
    abstract speedMenuItem: HTMLLIElement | null;

    invoker?: Invoker;

    commands: VideoCommands = {
        play: this.playCommand(),

        speed: (up: boolean): Command => this.speedCommand(up),

        fullscreen: this.fullscreenCommand(),

        theater: this.nullCommand(),

        fullwebpage: this.nullCommand(),

        miniplayer: this.nullCommand(),

        danmu: this.nullCommand(),

        mute: this.muteCommand(),

        volume: (delta: number): Command => this.volumeCommand(delta),

        skip: (delta: number): Command => this.skipCommand(delta),

        seek: (pos: number): Command => this.seekCommand(pos),
    };

    abstract setup(keydownHandler: (event: KeyboardEvent) => void): Promise<void>;

    protected $<E extends Element = Element>(selectors: string): E | null {
        return this.document?.querySelector<E>(selectors) ?? null;
    }

    protected nullCommand(): Command {
        return {
            enabled: false,
            call: async (): Promise<boolean> => false,
            status: async (): Promise<boolean> => false,
            message: async (): Promise<null> => null,
        };
    }

    protected playCommand(): Command {
        return {
            enabled: true,
            call: async (): Promise<boolean> => {
                if (this.invoker)
                    await this.invoker.play();
                else {
                    let video = this.videoHolder;
                    if (!video)
                        return false;
                    video.paused ? video.play() : video.pause();
                }
                return true;
            },
            status: async (): Promise<boolean> => {
                return this.invoker
                    ? await this.invoker.playStatus()
                    : this.videoHolder?.paused !== true;
            },
            message: async (): Promise<null> => null,
        };
    }

    protected playCommandWithButton(): Command {
        return {
            enabled: true,
            call: async (): Promise<boolean> => {
                let playButton = this.playButton;
                if (!playButton)
                    return false;
                playButton.click();
                return true;
            },
            status: async (): Promise<boolean> => {
                return this.invoker
                    ? await this.invoker.playStatus()
                    : this.videoHolder?.paused !== true;
            },
            message: async (): Promise<null> => null,
        };
    }

    protected speedCommand(up: boolean): Command {
        return {
            enabled: true,
            call: async (): Promise<boolean> => {
                let oldItem = this.speedMenuItem;
                if (!oldItem)
                    return false;
                let newItem = (up ? oldItem.previousElementSibling : oldItem.nextElementSibling) as HTMLLIElement | null;
                // display the current speed even reached the end
                if (!newItem?.click)
                    return true;
                newItem.click();
                return true;
            },
            status: async (): Promise<number> => {
                if (this.invoker)
                    return this.invoker.speedStatus();
                return this.videoHolder?.playbackRate ?? -1;
            },
            message: async (): Promise<string | null> => {
                let speed = this.invoker
                    ? await this.invoker.speedStatus()
                    : this.videoHolder?.playbackRate ?? null;
                if (speed === null)
                    return null;
                return `${speed}x`;
            },
        };
    }

    protected fullscreenCommand(): Command {
        return {
            enabled: true,
            call: async (): Promise<boolean> => {
                let fullscreenButton = this.fullscreenButton;
                if (!fullscreenButton)
                    return false;
                fullscreenButton.click();
                return true;
            },
            status: async (): Promise<boolean> => false,
            message: async (): Promise<null> => null,
        };
    }

    protected theaterCommand(): Command {
        return {
            enabled: true,
            call: async (): Promise<boolean> => {
                let theaterButton = this.theaterButton;
                if (!theaterButton)
                    return false;
                theaterButton.click();
                return true;
            },
            status: async (): Promise<boolean> => false,
            message: async (): Promise<null> => null,
        };
    }

    protected fullwebpageCommand(): Command {
        return {
            enabled: true,
            call: async (): Promise<boolean> => {
                let fullwebpageButton = this.fullwebpageButton;
                if (!fullwebpageButton)
                    return false;
                fullwebpageButton.click();
                return true;
            },
            status: async (): Promise<boolean> => false,
            message: async (): Promise<null> => null,
        };
    }

    protected miniplayerCommand(): Command {
        return {
            enabled: true,
            call: async (): Promise<boolean> => {
                let miniplayerButton = this.miniplayerButton;
                if (!miniplayerButton)
                    return false;
                miniplayerButton.click();
                return true;
            },
            status: async (): Promise<boolean> => false,
            message: async (): Promise<null> => null,
        };
    }

    protected muteCommand(): Command {
        return {
            enabled: true,
            call: async (): Promise<boolean> => {
                if (this.invoker) {
                    await this.invoker.mute();
                    return true;
                }
                let video = this.videoHolder;
                if (!video)
                    return false;
                video.muted = !video.muted;
                return true;
            },
            status: async (): Promise<boolean> => {
                return this.invoker
                    ? await this.invoker.muteStatus()
                    : this.videoHolder?.muted === true;
            },
            message: async (): Promise<string | null> => {
                let muted = this.invoker
                    ? await this.invoker.muteStatus()
                    : this.videoHolder?.muted ?? null;
                if (muted === null)
                    return null;
                return muted ? Overlay.volumeOffIcon : Overlay.volumeUpIcon;
            },
        };
    }

    protected volumeCommand(delta: number): Command {
        return {
            enabled: true,
            call: async (): Promise<boolean> => {
                if (this.invoker) {
                    await this.invoker.volume(delta);
                    if (await this.invoker.muteStatus())
                        await this.invoker.mute();
                }
                else {
                    let video = this.videoHolder;
                    if (!video)
                        return false;
                    if (video.muted)
                        video.muted = false;
                    video.volume = Math.max(0, Math.min(1, video.volume + delta));
                }
                return true;
            },
            status: async (): Promise<number> => {
                if (this.invoker)
                    return this.invoker.volumeStatus();
                return this.videoHolder?.volume ?? -1;
            },
            message: async (): Promise<string | null> => {
                let muted = this.invoker ?
                    await this.invoker.muteStatus() : this.videoHolder?.muted ?? null;
                if (muted)
                    return Overlay.volumeOffIcon;
                let volume = this.invoker ?
                    await this.invoker.volumeStatus()
                    : this.videoHolder?.volume ?? null;
                if (volume === null)
                    return null;
                return `${Math.round(volume * 100)}%`;
            },
        };
    }

    protected skipCommand(delta: number): Command {
        return {
            enabled: true,
            call: async (): Promise<boolean> => {
                if (this.invoker) {
                    await this.invoker.skip(delta);
                }
                else {
                    let video = this.videoHolder;
                    if (!video)
                        return false;
                    let newTime = video.currentTime + video.playbackRate * delta;
                    if (newTime === video.currentTime)
                        return false;
                    video.currentTime = Math.max(0, Math.min(video.duration, newTime));
                }
                return true;
            },
            status: async (): Promise<number> => {
                return this.invoker
                    ? await this.invoker.skipStatus()
                    : this.videoHolder?.currentTime ?? -1;
            },
            message: async (): Promise<null> => null,
        };
    }

    protected seekCommand(pos: number): Command {
        return {
            enabled: true,
            call: async (): Promise<boolean> => {
                if (this.invoker) {
                    await this.invoker.seek(pos);
                }
                else {
                    let video = this.videoHolder;
                    if (!video)
                        return false;
                    video.currentTime = pos * video.duration;
                }
                return true;
            },
            status: async (): Promise<number | null> => {
                if (this.invoker)
                    return await this.invoker.seekStatus();
                let video = this.videoHolder;
                if (!video)
                    return null;
                return video.currentTime / video.duration;
            },
            message: async (): Promise<null> => null,
        };
    }
}