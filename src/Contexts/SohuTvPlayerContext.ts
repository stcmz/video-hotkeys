import { CommandName } from "../Core/Command";
import { Hostname } from "../Core/Hostname";
import { NativeVideo } from "../Core/NativeVideo";
import { PlayerContext } from "../Core/PlayerContext";
import { Video } from "../Core/Video";

export class SohuTvPlayerContext implements PlayerContext {
    name: string = "SohuTv";

    hosts: Hostname[] = [
        { match: "tv.sohu.com" },
    ];

    allowedCommands: CommandName[] = [
        "play", "speed", "skip", "seek", "mute", "volume", "episode", "fullscreen", "fullwebpage", "miniplayer", "danmu",
    ];

    video: Video = new NativeVideo([
        { element: "shpdiv.x-player video" },
    ]);

    getFullscreenButton(): HTMLElement | null {
        return this.video.$(".x-fullscreen-btn");
    }

    getFullwebpageButton(): HTMLElement | null {
        return this.video.$(".x-pagefs-btn");
    }

    getMiniplayerButton(): HTMLElement | null {
        return this.video.$(".x-pipsmall-btn");
    }

    getDanmuButton(): HTMLElement | null {
        return this.video.$("#sohuplayer .tm-tmbtn");
    }

    getDanmuStatus(elem: HTMLElement): boolean | null {
        return elem.classList.contains("tm-tmbtn-over")
    }

    getActiveSpeedMenuItem(): HTMLElement | null {
        return this.video.$(".x-playrate-panel button.on");
    }

    getActiveEpisodeMenuItem(): HTMLElement | null {
        return document.querySelector("#listF .list_xl ul > li.on, #listF .list_juji ul li.on");
    }

    getEpisodeTitle(elem: HTMLElement): string | null {
        return elem.querySelector(".txt a")?.textContent ?? null;
    }

    extraSelector: string = ".x-dash-tip-panel, .x-clock, .x-bezel";
}