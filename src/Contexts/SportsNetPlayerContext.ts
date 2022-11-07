import { CommandName } from "../Core/Command";
import { Hostname } from "../Core/Hostname";
import { NativeVideo } from "../Core/NativeVideo";
import { PlayerContext } from "../Core/PlayerContext";
import { Video } from "../Core/Video";

export class SportsNetPlayerContext implements PlayerContext {
    name: string = "SportsNetCA";

    hosts: Hostname[] = [
        { match: "www.sportsnet.ca" },
    ];

    allowedCommands: CommandName[] = [
        "play", "speed", "skip", "skip2x", "skip4x", "seek", "mute", "volume", "episode", "fullscreen",
    ];

    video: Video = new NativeVideo([
        { element: ".snplayer > video" },
    ]);

    getFullscreenButton(): HTMLElement | null {
        return this.video.$("button.vjs-fullscreen-control");
    }
}