import { CommandName } from "../Core/Command";
import { Hostname } from "../Core/Hostname";
import { NativeVideo } from "../Core/NativeVideo";
import { PlayerContext } from "../Core/PlayerContext";
import { Video } from "../Core/Video";

export class XiguaPlayerContext implements PlayerContext {
    name: string = "Xigua";

    hosts: Hostname[] = [
        { match: "www.ixigua.com" },
    ];

    allowedCommands: CommandName[] = [
        "play", "speed", "skip", "seek", "mute", "volume", "episode", "fullscreen", "theater", "fullwebpage", "danmu",
    ];

    video: Video = new NativeVideo([
        { element: "#player_default.xgplayer > video" },
    ]);

    getFullscreenButton(): HTMLElement | null {
        return this.video.$("[aria-label=全屏],[aria-label=退出全屏]");
    }

    getTheaterButton(): HTMLElement | null {
        return this.video.$("[aria-label=剧场模式],[aria-label=退出剧场模式]");
    }

    getFullwebpageButton(): HTMLElement | null {
        return this.video.$(".xgplayer-cssfullscreen button");
    }

    getDanmuButton(): HTMLElement | null {
        return this.video.$(".danmakuBar__switch");
    }

    getDanmuStatus(elem: HTMLElement): boolean | null {
        return elem.getAttribute("aria-checked") === "true";
    }

    getActiveSpeedMenuItem(): HTMLElement | null {
        return this.video.$(".control_playbackrate li.isActive");
    }

    getActiveEpisodeMenuItem(): HTMLElement | null {
        return this.video.$(".playlist__panel__selectBoard a.active, .officialRichPlaylist .richPlayCard--active, .projection-series-list .projection-series-list-item.focus");
    }

    getEpisodeTitle(elem: HTMLElement): string | null {
        if (elem.nodeName == "A")
            return elem.title;
        return elem.querySelector(".title, .HorizontalFeedCard__title")?.textContent ?? null;
    }

    extraSelector: string = ".common-xgplayer__LBTips, .common-xgplayer__Logo";
}