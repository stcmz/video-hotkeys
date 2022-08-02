import { CommandName } from "../Core/Command";
import { Hostname } from "../Core/Hostname";
import { PlayerContext } from "../Core/PlayerContext";
import { NativeVideo } from "../Core/NativeVideo";
import { Video } from "../Core/Video";

export class TencentPlayerContext implements PlayerContext {
    name: string = "Tencent";

    hosts: Hostname[] = [
        { match: "v.qq.com" },
    ];

    allowedCommands: CommandName[] = [
        "play", "speed", "skip", "seek", "mute", "volume", "episode", "fullscreen", "fullwebpage", "miniplayer", "danmu",
    ];

    video: Video = new NativeVideo([
        { element: "#player > .txp_videos_container > video[src]" },
    ]);

    getFullscreenButton(): HTMLElement | null {
        return this.video.$(".txp_btn_fullscreen");
    }

    getFullwebpageButton(): HTMLElement | null {
        return this.video.$(".txp_btn_fake");
    }

    getMiniplayerButton(): HTMLElement | null {
        return this.video.$(".txp_btn_pip");
    }

    getDanmuButton(): HTMLElement | null {
        return this.video.$(".barrage-switch");
    }

    getDanmuStatus(elem: HTMLElement): boolean | null {
        return elem.classList.contains("active");
    }

    onVolume(volume: number): void {
        let vol = this.video.$(".txp_volume_range_current");
        if (vol)
            vol.style.height = `${Math.round(volume * 100)}%`;
    }

    reverseSpeedControl: boolean = true;

    getActiveSpeedMenuItem(): HTMLElement | null {
        return this.video.$(".txp_popup_playrate > .txp_popup_content .txp_current");
    }

    getActiveEpisodeMenuItem(): HTMLElement | null {
        let item = this.video.$(".episode-list > .episode-list-hor > .episode-item--active");
        if (item)
            return item;
        return this.video.$(".episode-list-rect__list .episode-item--active")?.parentElement ?? null;
    }

    isEpisodeMenuItem(elem: HTMLElement): boolean {
        return elem.classList.contains("episode-item") || elem.classList.contains("episode-list-rect__item");
    }

    openEpisode(elem: HTMLElement): void {
        let child = <HTMLElement>elem.firstElementChild;
        if (!child) {
            if (elem.click)
                elem.click();
        }
        else {
            child.click();
        }
    }

    getEpisodeTitle(elem: HTMLElement): string | null {
        return elem?.querySelector(".episode-item-portriat__info")?.textContent ?? elem?.textContent;
    }

    extraSelector: string = ".txp_alert_text, .txp-watermark";
}