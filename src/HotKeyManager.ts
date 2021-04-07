import { Command } from "./Command";
import { Overlay } from "./Overlay";
import { VideoProvider } from "./Providers/VideoProvider";

export class HotKeyManager {
    private static _overlay?: Overlay;
    private static _provider?: VideoProvider;

    public static setVideoProvider(provider: VideoProvider) {
        HotKeyManager._provider = provider;

        let loader = setInterval(() => {
            if (!provider.isReady)
                return;
            clearInterval(loader);

            let holder = provider.overlayHolder;
            if (holder !== null)
                HotKeyManager._overlay = new Overlay(holder);

            provider.setup(HotKeyManager.keyDownHandler);

            console.debug(`[video-hotkeys] loaded for ${provider.name}`);
        }, 300);
    }

    public static keyDownHandler(ev: KeyboardEvent): void {
        if (top.document.activeElement?.tagName === "INPUT"
            || top.document.activeElement?.tagName === "TEXTAREA"
            || top.document.activeElement?.tagName === "SELECT"
            || ev.altKey || ev.ctrlKey)
            return;

        let cmd = HotKeyManager.command(ev.key);

        if (!cmd || !cmd.enabled || !cmd.call())
            return;

        let msg = cmd.message();
        if (msg)
            HotKeyManager._overlay?.show(msg);

        ev.preventDefault();
        ev.stopPropagation();
    }

    private static command(key: string): Command | null {
        let commands = HotKeyManager._provider?.commands;

        if (!commands)
            return null;
        
        if ("0" <= key && key <= "9")
            return commands.seek((key.charCodeAt(0) - "0".charCodeAt(0)) / 10);

        switch (key) {
            case " ":
                return commands.play;

            case "d":
            case "D":
                return commands.danmu;

            case "f":
            case "F":
                return commands.fullscreen;

            case "m":
            case "M":
                return commands.mute;

            case "<":
            case ">":
                return commands.speed(key == ">");

            case "ArrowLeft":
            case "ArrowRight":
                return commands.skip(key == "ArrowRight" ? 5 : -5);

            case "ArrowUp":
            case "ArrowDown":
                return commands.volume(key == "ArrowUp" ? 0.05 : -0.05);

            default:
                return null;
        }
    }
}