import { Command } from "../Command";
import { Overlay } from "../Overlay";
import { VideoCommands, VideoProvider } from "./VideoProvider";

export class IxiguaVideoProvider extends VideoProvider {
    name: string = "iXigua";

    get document(): Document {
        return top.document;
    }

    get isReady(): boolean {
        if (this.document.readyState !== "complete")
            return false;

        if (!this.danmuButton)
            return false;

        return true;
    }

    get isPlayer(): boolean {
        return !!this.$("#player_default.xgplayer");
    }

    get videoHolder(): HTMLVideoElement | null {
        return this.$("#player_default.xgplayer video");
    }

    get overlayHolder(): HTMLDivElement | null {
        return this.$("#player_default.xgplayer");
    }

    get playButton(): HTMLButtonElement | null {
        return this.$(".xgplayer-playBtn button");
    }

    get fullscreenButton(): HTMLButtonElement | null {
        return this.$(".xgplayer-fullscreen button");
    }

    get speedMenuItem(): HTMLLIElement | null {
        return this.$(".xgplayer-playbackRate li.selected");
    }

    private get speedTips(): HTMLDivElement | null {
        return this.$(".common-xgplayer__LBTips");
    }

    private get danmuButton(): HTMLButtonElement | null {
        return this.$(".danmakuBar__switch");
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
                button.click();
                return true;
            },
            status: (): boolean => {
                let button = this.danmuButton;
                if (!button)
                    return false;
                return button.getAttribute("aria-checked") === "true";
            },
            message: (): string | null => {
                let button = this.danmuButton;
                if (!button)
                    return null;
                return button.getAttribute("aria-checked") === "true" ? Overlay.danmuOnText : Overlay.danmuOffText;
            },
        },

        mute: this.muteCommand(),

        volume: (delta: number): Command => this.volumeCommand(delta),

        skip: (delta: number): Command => this.skipCommand(delta),

        seek: (pos: number): Command => this.seekCommand(pos),
    };

    setup(keydownHandler: (event: KeyboardEvent) => void): void {
        // register keydown event handler
        top.document.body.onkeydown = this.videoHolder!.onkeydown = keydownHandler;

        // remove default speed tips
        this.speedTips?.remove();

        // auto hide danmu
        if (this.commands.danmu.status())
            this.commands.danmu.call();

        // normalize playback rate text
        this.speedMenuItem?.parentElement
            ?.querySelectorAll<HTMLLIElement>("li")
            ?.forEach(o => o.textContent = o.textContent?.replace("倍", "x") ?? null);
    }
}