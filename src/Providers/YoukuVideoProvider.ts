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
        return !!this.$(".youku-film-player");
    }

    get videoHolder(): HTMLVideoElement | null {
        return this.$(".youku-film-player video");
    }

    get overlayHolder(): HTMLDivElement | null {
        return this.$(".youku-film-player");
    }

    get playButton(): HTMLButtonElement | null {
        return this.$(".youku-film-player .control-play-icon");
    }

    get fullscreenButton(): HTMLButtonElement | null {
        let fsButton = this.$<HTMLButtonElement>(".youku-film-player .control-fullscreen-icon");
        if (!fsButton)
            return null;

        let hsButton = this.$<HTMLButtonElement>(".youku-film-player .control-halfscreen-icon");
        if (!hsButton)
            return null;

        return fsButton.style.display === "none" ? hsButton : fsButton;
    }

    get theaterButton(): HTMLButtonElement | null {
        return null;
    }

    get fullwebpageButton(): HTMLButtonElement | null {
        return this.$<HTMLButtonElement>(".youku-film-player .control-webfullscreen-icon");
    }

    get miniplayerButton(): HTMLButtonElement | null {
        return this.$<HTMLButtonElement>(".youku-film-player .control-quality-icon[data-tip=画中画]");
    }

    get speedMenuItem(): HTMLLIElement | null {
        return this.$(".rate-dashboard .active");
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
        this.$(".youku-layer-logo")?.remove();
    }
}