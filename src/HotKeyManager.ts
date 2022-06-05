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

            // create hotkey overlay
            let holder = provider.overlayHolder;
            if (holder !== null)
                HotKeyManager._overlay = new Overlay(holder);

            // set player background to pure black
            let video = provider.videoHolder;
            if (video !== null)
                video.style.setProperty("background", "#000", "important");

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

        let cmd = HotKeyManager.command(ev.code, ev.shiftKey);

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

    private static command(code: string, shift: boolean): Command | null {
        let commands = HotKeyManager._provider?.commands;

        if (!commands)
            return null;

        if (code.startsWith("Digit"))
            return shift ? null : commands.seek((code.charCodeAt(5) - "0".charCodeAt(0)) / 10);

        switch (code) {
            case "KeyK":
            case "Space":
                return commands.play;

            case "KeyD":
                return commands.danmu;

            case "KeyF":
                return commands.fullscreen;

            case "KeyT":
                return commands.theater;

            case "KeyW":
                return commands.fullwebpage;

            case "KeyI":
                return commands.miniplayer;

            case "KeyM":
                return commands.mute;

            case "Comma": // ,<
            case "Period": // .>
                return shift ? commands.speed(code == "Period") : null;

            case "KeyH":
                return commands.skip(-20);

            case "Semicolon": // ;:
                return commands.skip(20);

            case "KeyJ":
                return commands.skip(-10);

            case "KeyL":
                return commands.skip(10);

            case "ArrowLeft":
            case "ArrowRight":
                return commands.skip(code == "ArrowRight" ? 5 : -5);

            case "ArrowUp":
            case "ArrowDown":
                return commands.volume(code == "ArrowUp" ? 0.05 : -0.05);

            default:
                return null;
        }
    }
}