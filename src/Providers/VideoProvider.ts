import { Command } from "../Command";
import { Overlay } from "../Overlay";

export interface VideoCommands {
    play: Command;
    speed(up: boolean): Command;

    fullscreen: Command;
    danmu: Command;

    mute: Command;
    volume(delta: number): Command;

    skip(delta: number): Command;
    seek(pos: number): Command;
}

export abstract class VideoProvider {
    abstract name: string;
    abstract document: Document;

    abstract isReady: boolean;
    abstract isPlayer: boolean;

    abstract videoHolder: HTMLVideoElement | null;
    abstract overlayHolder: HTMLDivElement | null;

    abstract playButton: HTMLButtonElement | null;
    abstract fullscreenButton: HTMLButtonElement | null;
    abstract speedMenuItem: HTMLLIElement | null;

    commands: VideoCommands = {
        play: this.playCommand(),

        speed: (up: boolean): Command => this.speedCommand(up),

        fullscreen: this.fullscreenCommand(),

        danmu: this.nullCommand(),

        mute: this.muteCommand(),

        volume: (delta: number): Command => this.volumeCommand(delta),

        skip: (delta: number): Command => this.skipCommand(delta),

        seek: (pos: number): Command => this.seekCommand(pos),
    };

    abstract setup(keydownHandler: (event: KeyboardEvent) => void): void;

    protected $<E extends Element = Element>(selectors: string): E | null {
        return this.document?.querySelector<E>(selectors) ?? null;
    }

    protected nullCommand(): Command {
        return {
            enabled: false,
            call: (): boolean => false,
            status: (): boolean => false,
            message: (): null => null,
        };
    }

    protected playCommand(): Command {
        return {
            enabled: true,
            call: (): boolean => {
                let playButton = this.playButton;
                if (!playButton)
                    return false;
                playButton.click();
                return true;
            },
            status: (): boolean =>
                this.videoHolder?.paused !== true,
            message: (): null => null,
        };
    }

    protected speedCommand(up: boolean): Command {
        return {
            enabled: true,
            call: (): boolean => {
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
            status: (): number =>
                this.videoHolder?.playbackRate ?? -1,
            message: (): string | null =>
                this.speedMenuItem?.textContent ?? null,
        };
    }

    protected fullscreenCommand(): Command {
        return {
            enabled: true,
            call: (): boolean => {
                let fullscreenButton = this.fullscreenButton;
                if (!fullscreenButton)
                    return false;
                fullscreenButton.click();
                return true;
            },
            status: (): boolean => false,
            message: (): null => null,
        };
    }

    protected muteCommand(): Command {
        return {
            enabled: true,
            call: (): boolean => {
                let video = this.videoHolder;
                if (!video)
                    return false;
                video.muted = !video.muted;
                return true;
            },
            status: (): boolean =>
                this.videoHolder?.muted === true,
            message: (): string | null => {
                let video = this.videoHolder;
                if (!video)
                    return null;
                return video.muted ? Overlay.volumeOffIcon : Overlay.volumeUpIcon;
            },
        };
    }

    protected volumeCommand(delta: number): Command {
        return {
            enabled: true,
            call: (): boolean => {
                let video = this.videoHolder;
                if (!video)
                    return false;
                if (video.muted)
                    video.muted = false;
                video.volume = Math.max(0, Math.min(1, video.volume + delta));
                return true;
            },
            status: (): number =>
                this.videoHolder?.volume ?? -1,
            message: (): string | null => {
                let video = this.videoHolder;
                if (!video)
                    return null;
                if (video.muted)
                    return Overlay.volumeOffIcon;
                return `${Math.round(video.volume * 100)}%`;
            },
        };
    }

    protected skipCommand(delta: number): Command {
        return {
            enabled: true,
            call: (): boolean => {
                let video = this.videoHolder;
                if (!video)
                    return false;
                let newTime = video.currentTime + video.playbackRate * delta;
                if (newTime === video.currentTime)
                    return false;
                video.currentTime = Math.max(0, Math.min(video.duration, newTime));
                return true;
            },
            status: (): number =>
                this.videoHolder?.currentTime ?? -1,
            message: (): null => null,
        };
    }

    protected seekCommand(pos: number): Command {
        return {
            enabled: true,
            call: (): boolean => {
                let video = this.videoHolder;
                if (!video)
                    return false;
                video.currentTime = pos * video.duration;
                return true;
            },
            status: (): number | null => {
                let video = this.videoHolder;
                if (!video)
                    return null;
                return video.currentTime / video.duration;
            },
            message: (): null => null,
        };
    }
}