import { Command } from "../Command";
import { Overlay } from "../Overlay";
import { VideoCommands, VideoProvider } from "./VideoProvider";

export class YoukuVideoProvider extends VideoProvider {
    name: string = "Youku";
    hosts: string[] = ["v.youku.com"];

    get document(): Document {
        return top!.document;
    }

    get isReady(): boolean {
        if (top!.document.readyState !== "complete")
            return false;

        return true;
    }

    get isPlayer(): boolean {
        return !!this.$(".youku-player");
    }

    get videoHolder(): HTMLVideoElement | null {
        return this.$(".youku-player video");
    }

    get overlayHolder(): HTMLDivElement | null {
        return this.$(".youku-player");
    }

    get playButton(): HTMLButtonElement | null {
        return this.$(".youku-player .control-play-icon");
    }

    get fullscreenButton(): HTMLButtonElement | null {
        return this.$(".kui-fullscreen-icon-0");
    }

    get theaterButton(): HTMLButtonElement | null {
        return null;
    }

    get fullwebpageButton(): HTMLButtonElement | null {
        return this.$<HTMLButtonElement>(".kui-webfullscreen-icon-0");
    }

    get miniplayerButton(): HTMLButtonElement | null {
        return this.$<HTMLButtonElement>(".kui-pip-icon-0");
    }

    get speedMenuItem(): HTMLLIElement | null {
        let menu = this.$(".kui-playrate-rate-dashboard");
        if (!menu)
            return null;
        for (let i = 0; i < menu.children.length; i++) {
            if ((<HTMLElement>menu.children[i]).style.color != "")
                return <HTMLLIElement>menu.children[i];
        }
        return null;
    }

    private get danmuButton(): HTMLDivElement | null {
        return this.$(".switch-img_12hDa");
    }

    commands: VideoCommands = {
        play: this.playCommand(),

        speed: (up: boolean): Command => this.speedCommand(up),

        fullscreen: this.fullscreenCommand(),

        theater: this.nullCommand(),

        fullwebpage: this.fullwebpageCommand(),

        miniplayer: this.miniplayerCommand(),

        danmu: {
            enabled: true,
            call: async (): Promise<boolean> => {
                let button = this.danmuButton;
                if (!button)
                    return false;
                button.click();
                return true;
            },
            status: async (): Promise<boolean> => {
                let button = this.danmuButton;
                if (!button)
                    return false;
                return button.classList.contains("turn-on_3h6RT");
            },
            message: async (): Promise<string | null> => {
                let button = this.danmuButton;
                if (!button)
                    return null;
                return button.classList.contains("turn-on_3h6RT") ? Overlay.danmuOnText : Overlay.danmuOffText;
            },
        },

        mute: this.muteCommand(),

        volume: (delta: number): Command => this.volumeCommand(delta),

        skip: (delta: number): Command => this.skipCommand(delta),

        seek: (pos: number): Command => this.seekCommand(pos),
    };

    async setup(keydownHandler: (event: KeyboardEvent) => void): Promise<void> {
        // register keydown event handler
        top!.document.body.addEventListener("keydown", keydownHandler);
        top!.document.body.addEventListener("keyup", ev => ev.stopPropagation());

        // prevent autoplay on seeking
        this.videoHolder?.addEventListener("canplay", ev => ev.stopPropagation(), true);

        // auto hide danmu
        if (await this.commands.danmu.status())
            await this.commands.danmu.call();

        // remove default information tips
        this.$<HTMLDivElement>(".information-tips")?.remove();

        // remove on-player logo
        this.$(".kui-pop-0")?.remove();
    }
}