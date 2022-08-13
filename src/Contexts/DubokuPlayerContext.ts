import { CommandName } from "../Core/Command";
import { Hostname } from "../Core/Hostname";
import { NativeVideo } from "../Core/NativeVideo";
import { PlayerContext } from "../Core/PlayerContext";
import { Video } from "../Core/Video";
import { Log } from "../Utils/Log";

export class DubokuPlayerContext implements PlayerContext {
    name: string = "Duboku";

    hosts: Hostname[] = [
        { match: "www.duboku.tv" },
        { match: "tv.gboku.com" },
    ];

    allowedCommands: CommandName[] = [
        "play", "speed", "skip", "skip2x", "skip4x", "seek", "mute", "volume", "episode", "fullscreen",
    ];

    video: Video = new NativeVideo([
        { iframe: "td#playleft iframe", element: ".video-js > video" },
    ]);

    getFullscreenButton(): HTMLElement | null {
        return this.video.$(".vjs-fullscreen-control");
    }

    reverseSpeedControl: boolean = true;

    getActiveSpeedMenuItem(): HTMLElement | null {
        return this.video.$(".vjs-menu-content li.vjs-checked");
    }

    isSpeedMenuItem(elem: HTMLElement): boolean {
        return elem.nodeName == "LI" && elem.classList.contains("vjs-speed");
    }

    getActiveEpisodeMenuItem(): HTMLElement | null {
        return document.querySelector("#playlist1 a.btn-warm")?.parentElement ?? null;
    }

    rebuildSpeedMenu(rates: number[]): boolean {
        // Clear the speed adjustment menu
        const doc = this.video.document;
        if (!doc) {
            console.warn(Log.format("no video document"));
            return false;
        }

        const menuHolder = doc.querySelector(".vjs-menu-speed .vjs-menu-content");
        if (!menuHolder) {
            console.warn(Log.format("no speed menu"));
            return false;
        }

        for (let i = menuHolder.childNodes.length - 1; i > 0; i--)
            menuHolder.childNodes[i].remove();

        // Update submenu size on extend
        let extendSpeed = doc.querySelector(".vjs-extend-speed");
        if (extendSpeed) {
            extendSpeed.addEventListener("click", () => {
                let div = doc.querySelector<HTMLElement>(".vjs-menu-div");
                if (div) {
                    div.style.width = "80px";
                    div.style.height = `${28 * (rates.length + 1)}px`;
                }
            });
        }

        // Recreate the speed adjustment menu
        for (let rate of rates) {
            let li = doc.createElement("li");
            li.className = "vjs-speed";
            li.innerHTML = `${rate}x`;

            if (rate === 1)
                li.classList.add("vjs-checked");

            menuHolder.appendChild(li);

            li.addEventListener("click", () => {
                let menuItem = this.getActiveSpeedMenuItem();
                if (menuItem)
                    menuItem.classList.remove("vjs-checked");
                let video = this.video.element;
                if (video)
                    video.playbackRate = rate;
                let span = this.video.$(".vjs-extend-speed span");
                if (span)
                    span.innerHTML = li.innerHTML;
                li.classList.add("vjs-checked");
            });
        }

        // Click default speed
        this.getActiveSpeedMenuItem!()?.click();

        return true;
    }
}