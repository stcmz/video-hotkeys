import { CommandName } from "../Core/Command";
import { Hostname } from "../Core/Hostname";
import { NativeVideo } from "../Core/NativeVideo";
import { PlayerContext } from "../Core/PlayerContext";
import { Video } from "../Core/Video";

export class AmazonVideoPlayerContext implements PlayerContext {
    name: string = "AmazonVideo";

    hosts: Hostname[] = [
        { match: "www.amazon.com" },
    ];

    allowedCommands: CommandName[] = [
        "play", "speed", "skip", "skip2x", "skip4x", "seek", "mute", "volume", "fullscreen", "miniplayer",
    ];

    video: Video = new NativeVideo([
        { element: "#dv-web-player video[src]" },
    ]);

    getFullscreenButton(): HTMLElement | null {
        return this.video.$(".atvwebplayersdk-fullscreen-button");
    }

    getMiniplayerButton(): HTMLElement | null {
        return this.video.$(".atvwebplayersdk-pictureinpicture-button");
    }
}