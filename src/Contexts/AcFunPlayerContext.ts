import { CommandName } from "../Core/Command";
import { Hostname } from "../Core/Hostname";
import { NativeVideo } from "../Core/NativeVideo";
import { PlayerContext } from "../Core/PlayerContext";
import { Video } from "../Core/Video";

export class AcFunPlayerContext implements PlayerContext {
    name: string = "AcFun";

    hosts: Hostname[] = [
        { match: "www.acfun.cn" },
    ];

    allowedCommands: CommandName[] = [
        "play", "speed", "skip", "skip2x", "skip4x", "seek", "mute", "volume", "episode", "fullscreen", "theater", "fullwebpage", "danmu",
    ];

    video: Video = new NativeVideo([
        { element: "#ACPlayer .container-video > video" },
    ]);

    getFullscreenButton(): HTMLElement | null {
        return this.video.$(".fullscreen-screen .btn-span");
    }

    getTheaterButton(): HTMLElement | null {
        return this.video.$(".film-model .btn-span");
    }

    getFullwebpageButton(): HTMLElement | null {
        return this.video.$(".fullscreen-web .btn-span");
    }

    getDanmuButton(): HTMLInputElement | null {
        return this.video.$(".danmaku-enabled");
    }

    getDanmuStatus(elem: HTMLElement): boolean | null {
        return elem.getAttribute("data-bind-attr") === "true";
    }

    getActiveSpeedMenuItem(): HTMLElement | null {
        return this.video.$(".speed-panel li.selected");
    }

    getActiveEpisodeMenuItem(): HTMLElement | null {
        return document.querySelector("#pagelet_partlist ul > li.active");
    }

    extraSelector: string = ".left-bottom-tip";
}