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
        "play", "speed", "skip", "seek", "mute", "volume", "episode", "fullscreen",
    ];

    video: Video = new NativeVideo([
        { iframe: ".videohtmlclass", element: "#instructions video" },
    ]);

    getFullscreenButton(): HTMLElement | null {
        return this.video.$(".vjs-fullscreen-control");
    }

    getActiveSpeedMenuItem(): HTMLElement | null {
        return this.video.$(".vjs-playback-rate .vjs-menu-item.vjs-selected");
    }

    getActiveEpisodeMenuItem(): HTMLElement | null {
        return document.querySelector(`#vlink_1 a[href$='${location.pathname}']`)?.parentElement ?? null;
    }

    rebuildSpeedMenu(rates: number[]): boolean {
        const doc = this.video.document;
        if (!doc) {
            console.warn(Log.format("no video document"));
            return false;
        }

        const menuHolder = doc.querySelector<HTMLElement>(".vjs-playback-rate .vjs-menu-content");
        if (!menuHolder) {
            console.warn(Log.format("no speed menu"));
            return false;
        }

        // Clear the speed adjustment menu
        menuHolder.innerHTML = "";
        menuHolder.style.background = "#000";
        menuHolder.style.maxHeight = "30em";

        // Recreate the speed adjustment menu
        let attr = (name: string, value: string): Attr => {
            let a = doc.createAttribute(name);
            a.value = value;
            return a;
        };

        for (let i = rates.length - 1; i >= 0; i--) {
            let li = doc.createElement("li");
            li.className = "vjs-menu-item";
            li.tabIndex = -1;
            li.attributes.setNamedItem(attr("role", "menuitemcheckbox"));
            li.attributes.setNamedItem(attr("aria-live", "polite"));
            li.attributes.setNamedItem(attr("aria-disabled", "false"));
            li.attributes.setNamedItem(attr("aria-checked", "false"));
            li.innerHTML = `${rates[i]}x <span class="vjs-control-text"> </span>`;

            if (rates[i] === 1)
                li.classList.add("vjs-selected");

            menuHolder.appendChild(li);

            li.addEventListener("click", () => {
                let menuItem = this.getActiveSpeedMenuItem!();
                if (menuItem)
                    menuItem.classList.remove("vjs-selected");
                let video = this.video.element;
                if (video)
                    video.playbackRate = rates[i];
                li.classList.add("vjs-selected");
            });
        }

        // Disable speed adjustment on button click
        let speedAdjustButton = doc.querySelector(".vjs-playback-rate-value");
        speedAdjustButton?.addEventListener("click", ev => ev.stopPropagation());

        return true;
    }
}