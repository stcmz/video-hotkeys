import { CommandName } from "../Core/Command";
import { Hostname } from "../Core/Hostname";
import { NativeVideo } from "../Core/NativeVideo";
import { PlayerContext } from "../Core/PlayerContext";
import { Video } from "../Core/Video";

export class YouTubePlayerContext implements PlayerContext {
    name: string = "YouTube";

    hosts: Hostname[] = [
        { match: "www.youtube.com" },
    ];

    allowedCommands: CommandName[] = [
        "skip4x", "episode",
    ];

    video: Video = new NativeVideo([
        { element: "#movie_player > div.html5-video-container > video" },
    ]);

    getActiveEpisodeMenuItem(): HTMLElement | null {
        return document.querySelector("#playlist.ytd-watch-flexy ytd-playlist-panel-video-renderer[selected]");
    }

    getEpisodeTitle(elem: HTMLElement): string | null {
        return elem.querySelector("h4")?.textContent ?? null;
    }
}