import { CommandName } from "../Core/Command";
import { Hostname } from "../Core/Hostname";
import { NativeVideo } from "../Core/NativeVideo";
import { PlayerContext } from "../Core/PlayerContext";
import { Video } from "../Core/Video";

export class QiyiPlayerContext implements PlayerContext {
    name: string = "iQiyi";

    hosts: Hostname[] = [
        { match: "www.iq.com" },
        { match: "www.iqiyi.com" },
    ];

    allowedCommands: CommandName[] = [
        "play", "speed", "skip", "skip2x", "skip4x", "seek", "mute", "volume", "episode", "fullscreen", "fullwebpage", "danmu",
    ];

    video: Video = new NativeVideo([
        { element: "[data-player-hook=container] video" },
    ]);

    getFullscreenButton(): HTMLElement | null {
        return this.video.$("iqpdiv[data-player-hook=bottom] .iqp-btn-fullscreen");
    }

    getFullwebpageButton(): HTMLElement | null {
        return this.video.$("iqpdiv[data-player-hook=bottom] .iqp-btn-webscreen");
    }

    getDanmuButton(): HTMLElement | null {
        return this.video.$("span.barrage-switch");
    }

    toggleDanmu(elem: HTMLElement): boolean {
        let bound = elem.getBoundingClientRect();
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
        elem.dispatchEvent(event);

        return true;
    }

    getDanmuStatus(elem: HTMLElement): boolean | null {
        return elem.classList.contains("barrage-switch-open");
    }

    getActiveSpeedMenuItem(): HTMLElement | null {
        return this.video.$(".iqp-pop-speed iqp.selected");
    }

    getActiveEpisodeMenuItem(): HTMLElement | null {
        return this.video.$(".lequ-episode-detail ul > li.selected, .intl-juji-list ul > li.selected");
    }

    getEpisodeTitle(elem: HTMLElement): string | null {
        return elem.querySelector("h3")?.textContent ?? elem.textContent ?? null;
    }

    extraSelector: string = ".logoShowAnimation, [data-player-hook=speedtips]";
}