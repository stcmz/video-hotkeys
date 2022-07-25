import { PlayerContext } from "../Core/PlayerContext";
import { RemoteVideo } from "../Core/RemoteVideo";
import { CommandName } from "../Core/Command";
import { Video } from "../Core/Video";
import { Hostname } from "../Core/Hostname";

export class BilibiliPlayerContext implements PlayerContext {
    name: string = "Bilibili";

    hosts: Hostname[] = [
        { match: "www.bilibili.com" },
    ];

    allowedCommands: CommandName[] = [
        "play", "speed", "skip", "seek", "mute", "volume", "episode", "fullscreen", "theater", "fullwebpage", "miniplayer", "danmu",
    ];

    video: Video = new RemoteVideo([
        { iframe: "#video-frame", element: ".bilibili-player-video video" },
        { iframe: ".t-bangumi iframe.t-video-switch", element: ".bilibili-player-video video" },
        { element: ".bpx-player-video-wrap video, .bilibili-player-video video, .bilibili-player-video bwp-video" }
    ]);

    getFullscreenButton(): HTMLElement | null {
        return this.video.$(".bilibili-player-iconfont-fullscreen-off, .squirtle-video-fullscreen, .bpx-player-ctrl-full");
    }

    getTheaterButton(): HTMLElement | null {
        return this.video.$(".bilibili-player-iconfont-widescreen-off, .squirtle-video-widescreen, .bpx-player-ctrl-wide");
    }

    getFullwebpageButton(): HTMLElement | null {
        return this.video.$(".bilibili-player-iconfont-web-fullscreen-off, .squirtle-video-pagefullscreen, .bpx-player-ctrl-web");
    }

    getMiniplayerButton(): HTMLElement | null {
        return this.video.$(".bilibili-player-iconfont-pip-off, .squirtle-video-pip, .bpx-player-ctrl-pip");
    }

    getDanmuButton(): HTMLInputElement | null {
        return this.video.$(".bui-danmaku-switch-input, .bui-switch-input[aria-label=弹幕], .bpx-player-dm-switch .bui-switch-input");
    }

    getActiveSpeedMenuItem(): HTMLElement | null {
        return this.video.$(".bilibili-player-video-btn-speed-menu-list.bilibili-player-active, .bpx-player-ctrl-playbackrate-menu-item.bpx-state-active, .squirtle-speed-select-list .active");
    }

    onVolume(volume: number): void {
        let num = this.video.$(".bilibili-player-video-volume-num");
        if (num)
            num.textContent = `${Math.round(volume * 100)}`;

        let slider = this.video.$(".bilibili-player-video-volumebar .bui-bar-normal");
        if (slider)
            slider.style.transform = `scaleY(${volume})`;

        let thumb = this.video.$(".bilibili-player-video-volumebar .bui-thumb");
        if (thumb)
            thumb.style.transform = `translateY(-${Math.round(volume * 480) / 10}px)`;
    }

    getActiveEpisodeMenuItem(): HTMLElement | null {
        return document.querySelector(".list-wrapper.longlist ul li.cursor")
            ?? document.querySelector(".video-section-list .playing")?.parentElement?.parentElement?.parentElement
            ?? document.querySelector(".video-section-list .video-episode-card__info-playing")?.parentElement
            ?? null;
    }

    getEpisodeTitle(elem: HTMLElement): string | null {
        return elem.querySelector(".ep-title")?.textContent
            ?? elem.querySelector(".video-episode-card__info-title")?.textContent
            ?? elem.querySelector("p")?.textContent?.trim()
            ?? elem.textContent;
    }
}