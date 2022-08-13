import { PlayerContext } from "../Core/PlayerContext";
import { CommandName } from "../Core/Command";
import { NativeVideo } from "../Core/NativeVideo";
import { Video } from "../Core/Video";
import { Hostname } from "../Core/Hostname";

export class GenericPlayerContext implements PlayerContext {
    name: string = "Generic";

    hosts: Hostname[] = [
        { match: "*" },
    ];

    allowedCommands: CommandName[] = [
        "play", "speed", "skip", "skip2x", "skip4x", "seek", "mute", "volume", "episode", "fullscreen",
    ];

    video: Video = new NativeVideo([
        { element: "video" },
    ]);

    hasPlayer(): boolean {
        return this.getVideoDoc() != null;
    }

    getVideoDoc(): Document {
        if (document.querySelector("video"))
            return document;

        let iframes = document.querySelectorAll("iframe");
        for (let i = 0; i < iframes.length; i++) {
            if (!iframes[i].contentDocument)
                continue;
            let video = iframes[i].contentDocument!.querySelector("video");
            if (video)
                return iframes[i].contentDocument!;
        }

        return null!;
    }
}