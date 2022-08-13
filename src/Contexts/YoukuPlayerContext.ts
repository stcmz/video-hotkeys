import { CommandName } from "../Core/Command";
import { Hostname } from "../Core/Hostname";
import { NativeVideo } from "../Core/NativeVideo";
import { PlayerContext } from "../Core/PlayerContext";
import { Video } from "../Core/Video";

export class YoukuPlayerContext implements PlayerContext {
    name: string = "Youku";

    hosts: Hostname[] = [
        { match: "v.youku.com" },
    ];

    allowedCommands: CommandName[] = [
        "play", "speed", "skip", "skip2x", "skip4x", "seek", "mute", "volume", "episode", "fullscreen", "fullwebpage", "miniplayer", "danmu",
    ];

    video: Video = new NativeVideo([
        { element: ".youku-player video" },
    ]);

    getFullscreenButton(): HTMLElement | null {
        return this.video.$(".kui-fullscreen-icon-0");
    }

    getFullwebpageButton(): HTMLElement | null {
        return this.video.$(".kui-webfullscreen-icon-0");
    }

    getMiniplayerButton(): HTMLElement | null {
        return this.video.$(".kui-pip-icon-0");
    }

    getDanmuButton(): HTMLElement | null {
        return this.video.$(".switch-img_12hDa");
    }

    getDanmuStatus(elem: HTMLElement): boolean | null {
        return elem.classList.contains("turn-on_3h6RT");
    }

    getActiveSpeedMenuItem(): HTMLElement | null {
        let menu = this.video.$(".kui-playrate-rate-dashboard");
        if (!menu)
            return null;
        for (let i = 0; i < menu.children.length; i++) {
            if ((<HTMLElement>menu.children[i]).style.color != "")
                return <HTMLElement>menu.children[i];
        }
        return null;
    }

    getActiveEpisodeMenuItem(): HTMLElement | null {
        return this.video.$(".anthology-content .currentTitle")?.parentElement?.parentElement?.parentElement ??
            this.video.$(".anthology-content .current-mask")?.parentElement ?? null;
    }

    getEpisodeTitle(elem: HTMLElement): string | null {
        return elem.title ?? elem.querySelector(".title, .label-text")?.textContent ?? elem.textContent;
    }

    extraSelector: string = ".information-tips, .kui-pop-0, .kui-message-information-item";
}