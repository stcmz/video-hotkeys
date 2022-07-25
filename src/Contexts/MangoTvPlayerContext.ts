import { CommandName } from "../Core/Command";
import { Hostname } from "../Core/Hostname";
import { NativeVideo } from "../Core/NativeVideo";
import { PlayerContext } from "../Core/PlayerContext";
import { Video } from "../Core/Video";

export class MangoTvPlayerContext implements PlayerContext {
    name: string = "MangoTV";

    hosts: Hostname[] = [
        { match: "w.mgtv.com" },
    ];

    allowedCommands: CommandName[] = [
        "play", "speed", "skip", "seek", "mute", "volume", "episode", "fullscreen", "fullwebpage", "miniplayer",
    ];

    video: Video = new NativeVideo([
        { element: "#mgtv-player-wrap container > video" },
    ]);

    getFullscreenButton(): HTMLElement | null {
        return this.video.$("mango-screen.control-item");
    }

    getFullwebpageButton(): HTMLElement | null {
        return this.video.$("mango-webscreen.control-item");
    }

    getMiniplayerButton(): HTMLElement | null {
        return this.video.$("mango-control-pip.control-item");
    }

    getActiveSpeedMenuItem(): HTMLElement | null {
        return this.video.$("mango-playrate a.focus");
    }

    getActiveEpisodeMenuItem(): HTMLElement | null {
        return document.querySelector(".m-tv-aside-list ul > li.focus");
    }

    getEpisodeTitle(elem: HTMLElement): string | null {
        return elem.querySelector("a")?.textContent ?? null;
    }

    extraSelector: string = ".control-tips-pop";
}