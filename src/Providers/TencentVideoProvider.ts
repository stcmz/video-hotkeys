import { Command } from "../Command";
import { Overlay } from "../Overlay";
import { VideoCommands, VideoProvider } from "./VideoProvider";

export class TencentVideoProvider extends VideoProvider {
    name: string = "Tencent";

    get document(): Document {
        return top.document;
    }

    get isReady(): boolean {
        if (top.document.readyState !== "complete")
            return false;

        return true;
    }

    get isPlayer(): boolean {
        return this.$(".tenvideo_player .txp_video_container") !== null;
    }

    get videoHolder(): HTMLVideoElement | null {
        return this.$(".tenvideo_player .txp_video_container video");
    }

    get overlayHolder(): HTMLDivElement | null {
        return this.$(".tenvideo_player .txp_video_container");
    }

    get playButton(): HTMLButtonElement | null {
        return this.$(".tenvideo_player .txp_btn_play");
    }

    get fullscreenButton(): HTMLButtonElement | null {
        return this.$(".tenvideo_player .txp_btn_fullscreen");
    }

    get speedMenuItem(): HTMLLIElement | null {
        return this.$(".tenvideo_player [data-role=txp-button-speed-list] .txp_current");
    }

    commands: VideoCommands = {
        play: this.playCommand(),

        speed: (up: boolean): Command => this.speedCommand(!up),

        fullscreen: this.fullscreenCommand(),

        danmu: {
            enabled: true,
            call: (): boolean => {
                let button = this.$<HTMLDivElement>(".txp_barrage_switch");
                if (!button)
                    return false;
                button.click();
                return true;
            },
            status: (): boolean => {
                let button = this.$<HTMLDivElement>(".txp_barrage_switch");
                if (!button)
                    return false;
                return button.classList.contains("txp_open");
            },
            message: (): string | null => {
                let button = this.$<HTMLDivElement>(".txp_barrage_switch");
                if (!button)
                    return null;
                return button.classList.contains("txp_open") ? Overlay.danmuOnText : Overlay.danmuOffText;
            },
        },

        mute: this.muteCommand(),

        volume: (delta: number): Command => {
            let cmd = this.volumeCommand(delta);

            return {
                enabled: true,
                call: (): boolean => {
                    let result = cmd.call();
                    if (!result)
                        return false;
                    let vol = this.$<HTMLDivElement>(".tenvideo_player .txp_volume_range_current");
                    if (vol)
                        vol.style.height = `${Math.round(this.videoHolder!.volume * 100)}%`;
                    return true;
                },
                status: (): number | boolean | null => cmd.status(),
                message: (): string | null => cmd.message(),
            };
        },

        skip: (delta: number): Command => this.skipCommand(delta),

        seek: (pos: number): Command => this.seekCommand(pos),
    };

    setup(keydownHandler: (event: KeyboardEvent) => void): void {
        // register keydown event handler
        top.document.body.addEventListener("keydown", keydownHandler, true);
        top.document.body.addEventListener("keyup", ev => ev.stopImmediatePropagation(), true);

        // auto hide danmu
        if (this.commands.danmu.status())
            this.commands.danmu.call();

        // hide default tips
        let tips = this.$<HTMLDivElement>(".tenvideo_player [data-role=txp-ui-tips]");
        if (tips)
            tips.style.display = "none";

        // disable muting on button click
        this.$<HTMLDivElement>(".tenvideo_player [data-role=txp-control-volume-button]")
            ?.addEventListener("click", ev => {
                let slider = this.$<HTMLDivElement>(".tenvideo_player .txp_popup_volume");
                if (slider) {
                    slider.style.display = (slider.style.display === "block" ? "none" : "block");
                    ev.stopPropagation();
                }
            }, true);
    }
}