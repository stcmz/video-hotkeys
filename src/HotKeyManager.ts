import { Command } from "./Command";
import { Log } from "./Log";
import { Overlay } from "./Overlay";
import { VideoProvider } from "./Providers/VideoProvider";

export class HotKeyManager {
    private static _overlay?: Overlay;
    private static _provider?: VideoProvider;

    public static setVideoProvider(provider: VideoProvider) {
        HotKeyManager._provider = provider;

        let loader = window.setInterval(async () => {
            if (!provider.isReady)
                return;
            window.clearInterval(loader);

            let holder = provider.overlayHolder;
            if (holder !== null)
                HotKeyManager._overlay = new Overlay(holder);

            await provider.setup(HotKeyManager.keyDownHandler);

            console.debug(Log.format(`loaded for ${provider.name}`));
        }, 300);
    }

    public static async keyDownHandler(ev: KeyboardEvent): Promise<void> {
        if (!HotKeyManager._overlay || !HotKeyManager._provider)
            return;

        if (top!.document.activeElement?.tagName === "INPUT"
            || top!.document.activeElement?.tagName === "TEXTAREA"
            || top!.document.activeElement?.tagName === "SELECT"
            || ev.altKey || ev.ctrlKey)
            return;

        let cmd = HotKeyManager.command(ev.key);

        if (!cmd || !cmd.enabled)
            return;

        ev.preventDefault();
        ev.stopPropagation();

        if (!await cmd.call())
            return;

        let msg = await cmd.message();
        if (msg) {
            if (!HotKeyManager._overlay.valid) {
                HotKeyManager._overlay = new Overlay(HotKeyManager._provider.overlayHolder!);
                console.debug(Log.format("recreated overlay"));
            }
            HotKeyManager._overlay.show(msg);
        }
    }

    private static command(key: string): Command | null {
        let commands = HotKeyManager._provider?.commands;

        if (!commands)
            return null;

        if ("0" <= key && key <= "9")
            return commands.seek((key.charCodeAt(0) - "0".charCodeAt(0)) / 10);

        switch (key) {
            case "k":
            case "K":
            case " ":
                return commands.play;

            case "d":
            case "D":
                return commands.danmu;

            case "f":
            case "F":
                return commands.fullscreen;

            case "t":
            case "T":
                return commands.theater;

            case "w":
            case "W":
                return commands.fullwebpage;

            case "i":
            case "I":
                return commands.miniplayer;

            case "m":
            case "M":
                return commands.mute;

            case "<":
            case ">":
                return commands.speed(key == ">");

            case "j":
            case "J":
                return commands.skip(-10);

            case "l":
            case "L":
                return commands.skip(10);

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