import { CommandName } from "./Command";
import { Hostname } from "./Hostname";
import { Video } from "./Video";

export interface PlayerContext {
    name: string;
    hosts: Hostname[];

    allowedCommands: CommandName[];

    video: Video;

    // Display mode buttons
    getFullscreenButton?(): HTMLElement | null;
    getTheaterButton?(): HTMLElement | null;
    getFullwebpageButton?(): HTMLElement | null;
    getMiniplayerButton?(): HTMLElement | null;

    // Danmu control
    getDanmuButton?(): HTMLElement | null;
    toggleDanmu?(elem: HTMLElement): boolean;
    getDanmuStatus?(elem: HTMLElement): boolean | null;

    // Speed control
    reverseSpeedControl?(): boolean;
    getActiveSpeedMenuItem?(): HTMLElement | null;
    isSpeedMenuItem?(elem: HTMLElement): boolean;
    getSpeed?(elem: HTMLElement): number | null;
    onSpeed?(speed: number): void;

    // Volume control
    onVolume?(volume: number): void;

    // Episode control
    reverseEpisodeControl?(): boolean;
    isEpisodeListPaged?(): boolean;
    getActiveEpisodeMenuItem?(): HTMLElement | null;
    isEpisodeMenuItem?(elem: HTMLElement): boolean;
    openEpisode?(elem: HTMLElement): void;
    getEpisodeClickItem?(elem: HTMLElement): HTMLElement | null;
    getEpisodeTitle?(elem: HTMLElement): string | null;

    // CSS Selector for on-player logos, tips, clocks, etc. to be hidden
    extraSelector?: string;

    // Rebuild the speed adjustment menu
    rebuildSpeedMenu?(rates: number[]): boolean;
}