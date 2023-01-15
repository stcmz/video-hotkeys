import { CommandName } from "../Core/Command";
import { PlayerContext } from "../Core/PlayerContext";
import { Video } from "../Core/Video";
import { Log } from "../Utils/Log";
import { NativeVideo } from "../Core/NativeVideo";
import { Hostname } from "../Core/Hostname";

export class PangziTvPlayerContext implements PlayerContext {
    name: string = "PangziTV";

    hosts: Hostname[] = [
        { match: "pangzitv.com", canonical: "www.pangzitv.com" },
        { match: "m.pangzitv.com" },
        { match: "www.pangzitv.com" },
    ];

    allowedCommands: CommandName[] = [
        "play", "speed", "skip", "skip2x", "skip4x", "seek", "mute", "volume", "episode", "fullscreen", "miniplayer"
    ];

    video: Video = new NativeVideo([
        { iframe: ".videohtmlclass", element: ".play-parent video" },
    ]);

    getFullscreenButton(): HTMLElement | null {
        return this.video.$(".vjs-fullscreen-control");
    }

    getMiniplayerButton(): HTMLElement | null {
        return this.video.$(".vjs-picture-in-picture-control");
    }

    getActiveSpeedMenuItem(): HTMLElement | null {
        return this.video.$(".vjs-menu-speed .vjs-menu-item.vjs-checked");
    }

    getActiveEpisodeMenuItem(): HTMLElement | null {
        return document.querySelector(`#vlink_1 a[href$='${location.pathname}']`)?.parentElement ?? null;
    }

    reverseSpeedControl(): boolean {
        return true;
    }

    isSpeedMenuItem(elem: HTMLElement): boolean {
        return elem.classList.contains("vjs-speed");
    }

    rebuildSpeedMenu(rates: number[]): boolean {
        const doc = this.video.document;
        if (!doc) {
            console.warn(Log.format("no video document"));
            return false;
        }

        const menuHolder = doc.querySelector<HTMLElement>(".vjs-menu-speed .vjs-menu-content");
        if (!menuHolder) {
            console.warn(Log.format("no speed menu"));
            return false;
        }

        // Clear the speed adjustment menu
        while (menuHolder.childNodes.length > 1)
            menuHolder.removeChild(menuHolder.lastChild!);

        // Recreate the speed adjustment menu
        for (let rate of rates) {
            let li = doc.createElement("li");
            li.className = "vjs-menu-item vjs-speed";
            li.innerHTML = `${rate}x`;

            if (rate === 1)
                li.classList.add("vjs-checked");

            menuHolder.appendChild(li);

            li.addEventListener("click", () => {
                let menuItem = this.getActiveSpeedMenuItem!();
                if (menuItem)
                    menuItem.classList.remove("vjs-checked");
                let video = this.video.element;
                if (video)
                    video.playbackRate = rate;
                li.classList.add("vjs-checked");
            });
        }

        return true;
    }
}