import { Command } from "./Command";
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

        danmu: this.nullCommand(),

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
            muteButton.addEventListener("click", ev => ev.stopPropagation());
            muteButton = muteButton?.querySelector(".iqp-label-svg");
            if (muteButton)
                muteButton.addEventListener("click", ev => ev.stopPropagation());
        }
    }
}