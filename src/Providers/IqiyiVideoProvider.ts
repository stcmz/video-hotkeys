import { Command } from "../Command";
import { Overlay } from "../Overlay";
import { VideoCommands, VideoProvider } from "./VideoProvider";

export class IqiyiVideoProvider extends VideoProvider {
    name: string = "iQiyi";

    get document(): Document {
        return top.document;
    }

    get isReady(): boolean {
        if (top.document.readyState !== "complete")
            return false;

        if (!this.speedTips)
            return false;

        return true;
    }

    get isPlayer(): boolean {
        return this.$(".iqp-player") !== null;
    }

    get videoHolder(): HTMLVideoElement | null {
        return this.$(".iqp-player video");
    }

    get overlayHolder(): HTMLDivElement | null {
        return this.$(".iqp-player");
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
        return this.$(".iqp-tip-stream[data-player-hook=speedtips]");
    }

    commands: VideoCommands = {
        play: this.nullCommand(),

        speed: (up: boolean): Command => this.speedCommand(up),

        fullscreen: this.fullscreenCommand(),

        danmu: {
            enabled: true,
            call: (): boolean => {
                let button = this.$<HTMLSpanElement>("span.barrage-switch");
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
                let button = this.$<HTMLSpanElement>("span.barrage-switch");
                if (!button)
                    return false;
                return button.classList.contains("barrage-switch-open");
            },
            message: (): string | null => {
                let button = this.$<HTMLSpanElement>("span.barrage-switch");
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
        let tips = this.$(".iqp-tip-stream[data-player-hook=speedtips]");
        if (tips)
            tips.remove();

        // disable muting on button click
        let muteButton = this.$<HTMLDivElement>(".iqp-btn-voice[data-player-hook=voice]");
        if (muteButton) {
            muteButton = muteButton?.querySelector(".iqp-label-svg");
            if (muteButton) {
                muteButton.style.padding = "20px 0";
                muteButton.addEventListener("click", ev => ev.stopPropagation());
            }
        }
    }
}