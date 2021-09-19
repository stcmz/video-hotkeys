import { Command } from "../Command";
import { Overlay } from "../Overlay";
import { InjectWebPageScript } from "../Communication/ExtensionSide";
import { VideoCommands, VideoProvider } from "./VideoProvider";

export class BilibiliVideoProvider extends VideoProvider {
    name: string = "Bilibili";

    get document(): Document {
        let iframe = top!.document.querySelector<HTMLIFrameElement>("#video-frame");
        if (iframe)
            return iframe.contentDocument!;
        return top!.document;
    }

    get isReady(): boolean {
        if (this.document.readyState !== "complete")
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
        return !!top!.document.querySelector("#bilibiliPlayer")
            || !!top!.document.querySelector<HTMLIFrameElement>("#video-frame")?.contentDocument;
    }

    get videoHolder(): HTMLVideoElement | null {
        return this.$<HTMLVideoElement>(".bilibili-player-video video,bwp-video");
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
            call: async (): Promise<boolean> => {
                let danmuCheckbox = this.danmuCheckbox;
                if (!danmuCheckbox)
                    return false;
                danmuCheckbox.click();
                return true;
            },
            status: async (): Promise<boolean> =>
                this.danmuCheckbox?.checked === true,
            message: async (): Promise<string | null> => {
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
                call: async (): Promise<boolean> => {
                    let volume: number;
                    if (this.invoker) {
                        volume = await this.invoker.volume(delta);
                    }
                    else {
                        let video = this.videoHolder;
                        if (!video)
                            return false;
                        volume = video.volume = Math.max(0, Math.min(1, video.volume + delta));
                    }

                    let num = this.$<HTMLDivElement>(".bilibili-player-video-volume-num");
                    if (num)
                        num.textContent = `${Math.round(volume * 100)}`;

                    let slider = this.$<HTMLDivElement>(".bilibili-player-video-volumebar .bui-bar-normal");
                    if (slider)
                        slider.style.transform = `scaleY(${volume})`;

                    let thumb = this.$<HTMLDivElement>(".bilibili-player-video-volumebar .bui-thumb");
                    if (thumb)
                        thumb.style.transform = `translateY(-${Math.round(volume * 480) / 10}px)`;

                    if (this.invoker) {
                        if (await this.invoker.muteStatus())
                            await this.invoker.mute();
                    }
                    else {
                        let video = this.videoHolder!;
                        if (video.muted)
                            video.muted = false;
                    }

                    return true;
                },
                status: (): Promise<number | boolean | null> => this.volumeCommand(0).status(),
                message: (): Promise<string | null> => this.volumeCommand(0).message(),
            };
        },

        skip: (delta: number): Command => this.skipCommand(delta),

        seek: (pos: number): Command => this.seekCommand(pos),
    };

    async setup(keydownHandler: (event: KeyboardEvent) => void): Promise<void> {
        // register keydown event handler
        top!.document.onkeydown = this.document.onkeydown = keydownHandler;

        let video = this.videoHolder!;

        if (video.tagName === "BWP-VIDEO")
            this.invoker = await InjectWebPageScript(".bilibili-player-video bwp-video");

        // auto play video
        if (!await this.commands.play.status())
            video.click();

        // auto hide danmu
        if (await this.commands.danmu.status())
            await this.commands.danmu.call();

        // disable muting on button click
        this.document.querySelectorAll<HTMLButtonElement>(".bilibili-player-video-btn-volume button")
            .forEach(el => el.disabled = true);
    }
}