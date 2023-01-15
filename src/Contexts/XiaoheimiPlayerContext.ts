import { CommandName } from "../Core/Command";
import { PlayerContext } from "../Core/PlayerContext";
import { Video } from "../Core/Video";
import { NativeVideo } from "../Core/NativeVideo";
import { Hostname } from "../Core/Hostname";

export class XiaoheimiPlayerContext implements PlayerContext {
    name: string = "Xiaoheimi";

    hosts: Hostname[] = [
        { match: "xiaoheimi.net" },
    ];

    allowedCommands: CommandName[] = [
        "play", "speed", "skip", "skip2x", "skip4x", "seek", "mute", "volume", "episode", "fullscreen", "danmu"
    ];

    video: Video = new NativeVideo([
        { iframe: "#iframe", element: "#player video" },
    ]);

    getFullscreenButton(): HTMLElement | null {
        return this.video.$(".yzmplayer-full-icon");
    }

    getActiveSpeedMenuItem(): HTMLElement | null {
        let speed = parseFloat(this.video.$(".yzmplayer-label.title")!.textContent!);
        if (Number.isNaN(speed))
            speed = 1;
        return this.video.$(`.yzmplayer-setting-speeds .yzmplayer-setting-speed-item[data-speed="${speed}"]`);
    }

    getActiveEpisodeMenuItem(): HTMLElement | null {
        return document.querySelector(".playlist li.active");
    }

    getDanmuButton(): HTMLElement | null {
        return this.video.$(".yzmplayer-showdan-setting-input");
    }

    toggleDanmu(elem: HTMLElement): boolean {
        elem.parentElement?.parentElement?.click();
        return true;
    }

    reverseSpeedControl(): boolean {
        return true;
    }
}