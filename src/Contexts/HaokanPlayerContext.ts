import { CommandName } from "../Core/Command";
import { Hostname } from "../Core/Hostname";
import { NativeVideo } from "../Core/NativeVideo";
import { PlayerContext } from "../Core/PlayerContext";
import { Video } from "../Core/Video";

export class HaokanPlayerContext implements PlayerContext {
    name: string = "Haokan";

    hosts: Hostname[] = [
        { match: "haokan.baidu.com" },
    ];

    allowedCommands: CommandName[] = [
        "play", "speed", "skip", "skip2x", "skip4x", "seek", "mute", "volume", "fullscreen", "fullwebpage", "miniplayer",
    ];

    video: Video = new NativeVideo([
        { element: ".art-video-player video" },
    ]);

    getFullscreenButton(): HTMLElement | null {
        return this.video.$(".art-control-fullscreen");
    }

    getFullwebpageButton(): HTMLElement | null {
        return this.video.$(".art-control-fullscreenWeb");
    }

    getMiniplayerButton(): HTMLElement | null {
        return this.video.$(".art-control-pip");
    }

    getActiveSpeedMenuItem(): HTMLElement | null {
        return this.video.$(".art-control-playrate .art-selector-item-active");
    }
}