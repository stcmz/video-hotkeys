import { CommandName } from "../Core/Command";
import { Hostname } from "../Core/Hostname";
import { NativeVideo } from "../Core/NativeVideo";
import { PlayerContext } from "../Core/PlayerContext";
import { Video } from "../Core/Video";

export class OleVodPlayerContext implements PlayerContext {
    name: string = "OleVOD";

    hosts: Hostname[] = [
        { match: "olevod.com", canonical: "www.olevod.com" },
        { match: "www.olevod.com" },
        { match: "olehdtv.com", canonical: "www.olehdtv.com" },
        { match: "www.olehdtv.com" },
        { match: "olevod.eu", canonical: "www.olevod.eu" },
        { match: "www.olevod.eu" },
        // { match: "oulevod.tv", canonical: "www.oulevod.tv" },
        // { match: "www.oulevod.tv" },
    ];

    allowedCommands: CommandName[] = [
        "play", "speed", "skip", "skip2x", "skip4x", "seek", "mute", "volume", "episode", "fullscreen", "miniplayer", "danmu",
    ];

    video: Video = new NativeVideo([
        { iframe: "td#playleft iframe", element: "div.plyr .plyr__video-wrapper > video" },
        { element: "div.plyr .plyr__video-wrapper > video" },
    ]);

    getFullscreenButton(): HTMLElement | null {
        return this.video.$(".plyr__controls__item[data-plyr=fullscreen]");
    }

    getMiniplayerButton(): HTMLElement | null {
        return this.video.$(".plyr__controls__item[data-plyr=pip]");
    }

    reverseSpeedControl(): boolean {
        return !!this.video.$("[data-plyr=speed][aria-checked=true]");
    }

    onSpeed(_: number): void {
        let div = this.video.$(".plyr__menu__container div");
        if (div) {
            div.style.width = "";
            div.style.height = "";
        }
    }

    getActiveSpeedMenuItem(): HTMLElement | null {
        return this.video.$("[data-plyr=speed][aria-checked=true], .player-control .multiple-box > .list.active");
    }

    getDanmuButton(): HTMLElement | null {
        return this.video.$(".danmaku-switch input[type=checkbox]");
    }

    onDanmuChanged(on: boolean): void {
        const textarea = document.querySelector<HTMLElement>("#w-e-textarea-1");
        if (textarea)
            textarea.contentEditable = on ? "true" : "false";
    }

    reverseEpisodeControl(): boolean {
        return document.querySelector(".tab-day > .level > span")?.textContent != "升序";
    }

    getActiveEpisodeMenuItem(): HTMLElement | null {
        return document.querySelector(".content_playlist li.active, .tab-day ul > .active, .tab-day .item > .active");
    }

    getEpisodeTitle(elem: HTMLElement): string | null {
        return elem.querySelector("h4")?.textContent ?? elem.querySelector(".wes")?.textContent ?? null;
    }
}