import { Command } from "../Command";
import { Overlay } from "../Overlay";
import { VideoCommands, VideoProvider } from "./VideoProvider";

export class QiyiVideoProvider extends VideoProvider {
    name: string = "iQiyi";

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
        return !!this.$("[data-player-hook=container]");
    }

    get videoHolder(): HTMLVideoElement | null {
        return this.$("[data-player-hook=container] video");
    }

    get overlayHolder(): HTMLDivElement | null {
        return this.$("[data-player-hook=container]");
    }

    get playButton(): HTMLButtonElement | null {
        return this.$(".iqp-btn-pause");
    }

    get fullscreenButton(): HTMLButtonElement | null {
        return this.$(".iqp-btn-fullscreen");
    }

    get speedMenuItem(): HTMLLIElement | null {
        return this.$(".iqp-pop-speed iqp.selected");
    }

    private get speedTips(): HTMLDivElement | null {
        return this.$("[data-player-hook=speedtips]");
    }

    private get danmuButton(): HTMLSpanElement | null {
        return this.$("span.barrage-switch");
    }

    commands: VideoCommands = {
        play: this.nullCommand(),

        speed: (up: boolean): Command => this.speedCommand(up),

        fullscreen: this.fullscreenCommand(),

        danmu: {
            enabled: true,
            call: (): boolean => {
                let button = this.danmuButton;
                if (!button)
                    return false;

                let bound = button.getBoundingClientRect();
                let clientX = bound.left + bound.width / 2 - 10;
                let clientY = bound.top + bound.height / 2;

                let event = document.createEvent("MouseEvent");
                event.initMouseEvent(
                    "mouseup",
                    true, true,
                    window, 1,
                    0, 0,
                    clientX, clientY,
                    false, false, false, false,
                    0, null);
                button.dispatchEvent(event);

                return true;
            },
            status: (): boolean => {
                let button = this.danmuButton;
                if (!button)
                    return false;
                return button.classList.contains("barrage-switch-open");
            },
            message: (): string | null => {
                let button = this.danmuButton;
                if (!button)
                    return null;
                return button.classList.contains("barrage-switch-open") ? Overlay.danmuOnText : Overlay.danmuOffText;
            },
        },

        mute: this.muteCommand(),

        volume: (delta: number): Command => this.volumeCommand(delta),

        skip: (delta: number): Command => this.skipCommand(delta),

        seek: (pos: number): Command => this.seekCommand(pos),
    };

    setup(keydownHandler: (event: KeyboardEvent) => void): void {
        // register keydown event handler
        top.document.body.onkeydown = keydownHandler;

        // remove default speed tips
        this.speedTips?.remove();

        // auto hide danmu
        if (this.commands.danmu.status())
            this.commands.danmu.call();

        // disable muting on button click
        this.overlayHolder?.addEventListener("click", ev => {
            // late check because the mute button isn't ready while playing ad
            let muteButton = this.$<HTMLDivElement>("[data-player-hook=voice]");
            if (muteButton && muteButton.contains(<Node>ev.target))
                ev.stopPropagation();
        }, true);

        // remove on-player logos
        this.$(".iqp-logo-box")?.remove();
    }
}