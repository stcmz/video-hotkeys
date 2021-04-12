import { Command } from "../Command";
import { Overlay } from "../Overlay";
import { VideoCommands, VideoProvider } from "./VideoProvider";

export class AcFunVideoProvider extends VideoProvider {
    name: string = "AcFun";

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
        return !!this.$("#ACPlayer");
    }

    get videoHolder(): HTMLVideoElement | null {
        return this.$("#ACPlayer video");
    }

    get overlayHolder(): HTMLDivElement | null {
        return this.$("#ACPlayer .container-video");
    }

    get playButton(): HTMLButtonElement | null {
        return this.$(".btn-play .btn-span");
    }

    get fullscreenButton(): HTMLButtonElement | null {
        return this.$(".fullscreen-screen .btn-span");
    }

    get speedMenuItem(): HTMLLIElement | null {
        return this.$(".speed-panel li.selected");
    }

    private get speedTips(): HTMLDivElement | null {
        return this.$(".left-bottom-tip");
    }

    private get danmuButton(): HTMLButtonElement | null {
        return this.$(".danmaku-enabled");
    }

    commands: VideoCommands = {
        play: this.playCommand(),

        speed: (up: boolean): Command => this.speedCommand(up),

        fullscreen: this.fullscreenCommand(),

        danmu: {
            enabled: true,
            call: (): boolean => {
                let button = this.danmuButton;
                if (!button)
                    return false;
                button.click();
                return true;
            },
            status: (): boolean => {
                let button = this.danmuButton;
                if (!button)
                    return false;
                return button.getAttribute("data-bind-attr") === "true";
            },
            message: (): string | null => {
                let button = this.danmuButton;
                if (!button)
                    return null;
                return button.getAttribute("data-bind-attr") === "true" ? Overlay.danmuOnText : Overlay.danmuOffText;
            },
        },

        mute: this.muteCommand(),

        volume: (delta: number): Command => this.volumeCommand(delta),

        skip: (delta: number): Command => this.skipCommand(delta),

        seek: (pos: number): Command => this.seekCommand(pos),
    };

    setup(keydownHandler: (event: KeyboardEvent) => void): void {
        // register keydown event handler
        top.document.body.onkeydown = ev => {
            keydownHandler(ev);
            // relieve official hotkey prevention
            ev.stopPropagation();
        };

        // remove default speed tips
        this.speedTips!.style.display = "none";

        // auto hide danmu
        if (this.commands.danmu.status())
            this.commands.danmu.call();
    }
}