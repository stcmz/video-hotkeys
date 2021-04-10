import { Command } from "../Command";
import { Overlay } from "../Overlay";
import { VideoCommands, VideoProvider } from "./VideoProvider";

export class BilibiliVideoProvider extends VideoProvider {
    name: string = "Bilibili";

    get document(): Document {
        let iframe = top.document.querySelector<HTMLIFrameElement>("#video-frame");
        if (iframe)
            return iframe.contentDocument!;
        return top.document;
    }

    get isReady(): boolean {
        if (this.document.readyState !== "complete")
            return false;
        if (!this.videoHolder?.readyState)
            return false;
        if (!this.playButton)
            return false;

        let testerSelector = ".bilibili-player-video-panel-text .bilibili-player-video-panel-row";
        let stateTesters = Array.from(this.document.querySelectorAll<HTMLElement>(testerSelector));

        if (!stateTesters.every(o => o.textContent?.substr(-4) === "[完成]"))
            return false;
        return true;
    }

    get isPlayer(): boolean {
        return top.document.querySelector("#bilibiliPlayer") !== null
            || top.document.querySelector<HTMLIFrameElement>("#video-frame")?.contentDocument
                ?.querySelector("#bilibiliPlayer") !== null;
    }

    get videoHolder(): HTMLVideoElement | null {
        return this.$(".bilibili-player-video video");
    }

    get overlayHolder(): HTMLDivElement | null {
        return this.$(".bilibili-player-video-wrap");
    }

    get playButton(): HTMLButtonElement | null {
        return this.$(".bilibili-player-video-btn-start button");
    }

    get fullscreenButton(): HTMLButtonElement | null {
        return this.$(".bilibili-player-iconfont-fullscreen-off");
    }

    get speedMenuItem(): HTMLLIElement | null {
        return this.$(".bilibili-player-video-btn-speed-menu-list.bilibili-player-active");
    }

    private get danmuCheckbox(): HTMLInputElement | null {
        return this.$(".bilibili-player-video-danmaku-switch .bui-switch-input");
    }

    commands: VideoCommands = {
        play: this.playCommand(),

        speed: (up: boolean): Command => this.speedCommand(up),

        fullscreen: this.fullscreenCommand(),

        danmu: {
            enabled: true,
            call: (): boolean => {
                let danmuCheckbox = this.danmuCheckbox;
                if (danmuCheckbox === null)
                    return false;
                danmuCheckbox.click();
                return true;
            },
            status: (): boolean =>
                this.danmuCheckbox?.checked === true,
            message: (): string | null => {
                let checkbox = this.danmuCheckbox;
                if (checkbox === null)
                    return null;
                return checkbox.checked ? Overlay.danmuOnText : Overlay.danmuOffText;
            },
        },

        mute: this.muteCommand(),

        volume: (delta: number): Command => {
            return {
                enabled: true,
                call: (): boolean => {
                    let video = this.videoHolder;
                    if (!video)
                        return false;

                    let volume = Math.max(0, Math.min(1, video.volume + delta));

                    let num = this.$<HTMLDivElement>(".bilibili-player-video-volume-num");
                    if (num)
                        num.textContent = `${Math.round(volume * 100)}`;

                    let slider = this.$<HTMLDivElement>(".bilibili-player-video-volumebar .bui-bar-normal");
                    if (slider)
                        slider.style.transform = `scaleY(${volume})`;

                    let thumb = this.$<HTMLDivElement>(".bilibili-player-video-volumebar .bui-thumb");
                    if (thumb)
                        thumb.style.transform = `translateY(-${Math.round(volume * 480) / 10}px)`;
                    video.volume = volume;

                    if (video.muted)
                        video.muted = false;

                    return true;
                },
                status: (): number => this.videoHolder?.volume ?? -1,
                message: (): string | null => super.volumeCommand(0).message(),
            };
        },

        skip: (delta: number): Command => this.skipCommand(delta),

        seek: (pos: number): Command => this.seekCommand(pos),
    };

    setup(keydownHandler: (event: KeyboardEvent) => void): void {
        // register keydown event handler
        top.document.onkeydown = this.document.onkeydown = keydownHandler;

        // auto play video
        let video = this.videoHolder!;
        if (video.paused)
            video.click();

        // auto hide danmu
        if (this.commands.danmu.status())
            this.commands.danmu.call();

        // disable muting on button click
        this.document.querySelectorAll<HTMLButtonElement>(".bilibili-player-video-btn-volume button")
            .forEach(el => el.disabled = true);
    }
}