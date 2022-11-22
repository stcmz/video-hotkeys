import { CommandName } from "../Core/Command";
import { Hostname } from "../Core/Hostname";
import { NativeVideo } from "../Core/NativeVideo";
import { PlayerContext } from "../Core/PlayerContext";
import { Video } from "../Core/Video";

export class NiVodPlayerContext implements PlayerContext {
    name: string = "NiVod";

    hosts: Hostname[] = [
        { match: "www.nivod.tv" },
    ];

    allowedCommands: CommandName[] = [
        "play", "speed", "skip", "skip2x", "skip4x", "seek", "mute", "volume", "episode", "fullscreen", "miniplayer", "fullwebpage", "danmu",
    ];

    video: Video = new NativeVideo([
        { element: "#dplayer > div.dplayer-video-wrap > video" },
    ]);

    getFullscreenButton(): HTMLElement | null {
        return this.video.$(".dplayer-full-icon");
    }

    getFullwebpageButton(): HTMLElement | null {
        return this.video.$(".dplayer-full-in-icon");
    }

    getMiniplayerButton(): HTMLElement | null {
        return this.video.$("#pip > button");
    }

    getDanmuButton(): HTMLElement | null {
        return document.querySelector("#danmu-c > .func-danmu span:not([style]) img, #danmu-c > .func-danmu span[style=''] img");
    }

    getDanmuStatus(elem: HTMLElement): boolean | null {
        return (<HTMLImageElement>elem).src.endsWith("open.png");
    }

    isEpisodeMenuItem(elem: HTMLElement): boolean {
        return elem.classList.contains("select-item");
    }

    reverseSpeedControl(): boolean {
        return true;
    }

    getActiveSpeedMenuItem(): HTMLElement | null {
        let speed = parseFloat(this.video.$("#speed_icon > span")?.textContent ?? "1");
        if (isNaN(speed))
            speed = 1;
        return this.video.$(`#dplayer div.dplayer-setting-speed-panel > div[data-speed='${speed}']`);
    }

    getSpeed(elem: HTMLElement): number | null {
        let speed = parseFloat(elem.textContent ?? "1");
        if (isNaN(speed))
            speed = 1;
        return speed;
    }

    isEpisodeListPaged(): boolean {
        return true;
    }

    getActiveEpisodeMenuItem(): HTMLElement | null {
        return document.querySelector("#play-list li.select-item.selected");
    }

    reverseEpisodeControl(): boolean {
        return this.video.$("#play_info_group > ul > li:nth-child(1) > a")?.textContent?.trim() == "顺序";
    }
}