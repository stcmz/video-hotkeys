import { Command, CommandName } from "./Command";
import { Log } from "../Utils/Log";
import { Overlay } from "./Overlay";
import { SpeedCommand } from "../Commands/SpeedCommand";
import { PlayerContext } from "./PlayerContext";
import { FullscreenCommand } from "../Commands/FullscreenCommand";
import { TheaterCommand } from "../Commands/TheaterCommand";
import { FullwebpageCommand } from "../Commands/FullwebpageCommand";
import { MiniplayerCommand } from "../Commands/MiniplayerCommand";
import { DanmuCommand } from "../Commands/DanmuCommand";
import { PlayCommand } from "../Commands/PlayCommand";
import { MuteCommand } from "../Commands/MuteCommand";
import { SkipCommand } from "../Commands/SkipCommand";
import { EpisodeCommand } from "../Commands/EpisodeCommand";
import { VolumeCommand } from "../Commands/VolumeCommand";
import { SeekCommand } from "../Commands/SeekCommand";
import { Settings } from "../Settings";

export class HotKeyManager {
    private static _overlay?: Overlay;
    static context?: PlayerContext;

    static onDocumentFound(doc: Document) {
        // Register keydown event handler
        doc.addEventListener("keydown", HotKeyManager.onKeyDown, true);

        // Prevent keyup seeking on some players
        doc.addEventListener("keyup", ev => ev.stopImmediatePropagation(), true);

        // Prevent autoplay on seeking on some players
        doc.addEventListener("seeking", ev => ev.stopImmediatePropagation(), true);

        // Hide default speed tips and on-player logos
        if (this.context?.extraSelector) {
            console.debug(Log.format("injecting hide extra style"));

            let style = doc.createElement("style");
            style.innerText = `${this.context?.extraSelector} { display: none !important; visibility: hidden !important }`;
            doc.head.appendChild(style);
        }
    }

    static async onVideoReady() {
        let context = HotKeyManager.context;
        if (!context)
            throw new Error("no context");

        // Set video background color
        let elem = context.video.element;
        if (elem) {
            console.debug(Log.format("setting video background"));

            elem.style.setProperty("background", Settings.videoBackgroundColor, "important");
        }

        // Auto play video
        if (context.allowedCommands.includes("play")) {
            console.debug(Log.format("trying to autoplay"));

            let play = new PlayCommand();
            play.context = context;
            await play.set(true);
        }

        // Rebuild the speed menu with unified rates
        if (context.rebuildSpeedMenu) {
            console.debug(Log.format("rebuilding speed menu"));

            context.rebuildSpeedMenu(Settings.speedBrackets);
        }
    }

    static async onProxyInjected() {
        let context = HotKeyManager.context;
        if (!context)
            throw new Error("no context");

        // Auto play video
        if (context.allowedCommands.includes("play")) {
            console.debug(Log.format("trying to autoplay"));

            let play = new PlayCommand();
            play.context = context;
            await play.set(true);
        }
    }

    static async onSignal(): Promise<boolean> {
        let context = HotKeyManager.context;
        if (!context)
            throw new Error("no context");

        // Auto hide danmu
        if (Settings.autoHideDanmu && context.allowedCommands.includes("danmu")) {
            console.debug(Log.format("hiding danmu"));

            let danmu = new DanmuCommand();
            danmu.context = context;
            if (!await danmu.set(false))
                return false;
        }

        return true;
    }

    static async onKeyDown(ev: KeyboardEvent): Promise<void> {
        let context = HotKeyManager.context;
        if (!context)
            throw new Error("no context");

        // No interference on normal user input
        const activeElem = document.activeElement;

        if ((activeElem?.tagName === "INPUT" && (<HTMLInputElement>activeElem).type !== "checkbox")
            || activeElem?.tagName === "TEXTAREA"
            || activeElem?.tagName === "SELECT"
            || ev.altKey || ev.ctrlKey)
            return;

        // Ensure video has initialized
        const videoDoc = context.video.document;

        if (videoDoc && !context.video.hasInited(videoDoc)) {
            console.debug(Log.format("re-initializing video"));
            HotKeyManager.onDocumentFound(videoDoc);
            context.video.init(videoDoc);
            await HotKeyManager.onVideoReady();
        }

        // Get the command
        let cmd = HotKeyManager.command(ev.code, ev.shiftKey);

        if (!cmd)
            return;

        ev.preventDefault();
        ev.stopPropagation();

        // Call the command and retrieve the message
        if (Settings.verboseLog)
            console.debug(Log.format(`calling ${cmd.name} command`));
        let msg = await cmd.call();

        if (msg.content) {
            if (HotKeyManager._overlay?.valid != true) {
                console.debug(Log.format("recreating overlay"));

                let elem = context.video.container;
                HotKeyManager._overlay = new Overlay(elem!);
            }

            HotKeyManager._overlay.show(msg.content, msg.duration ?? Settings.defaultOverlayDuration);
        }
    }

    private static _hotkeyMapShift = new Map<string, [CommandName, Command]>([
        ["Comma", ["speed", new SpeedCommand(false)]], // <
        ["Period", ["speed", new SpeedCommand(true)]], // >
    ]);

    private static _hotkeyMapNoShift = new Map<string, [CommandName, Command]>([
        ["KeyF", ["fullscreen", new FullscreenCommand()]],
        ["KeyT", ["theater", new TheaterCommand()]],
        ["KeyW", ["fullwebpage", new FullwebpageCommand()]],
        ["KeyI", ["miniplayer", new MiniplayerCommand()]],
        ["KeyD", ["danmu", new DanmuCommand()]],
        ["KeyK", ["play", new PlayCommand()]],
        ["Space", ["play", new PlayCommand()]],
        ["KeyM", ["mute", new MuteCommand()]],
        ["ArrowLeft", ["skip", new SkipCommand(-5)]],
        ["ArrowRight", ["skip", new SkipCommand(5)]],
        ["KeyJ", ["skip", new SkipCommand(-10)]],
        ["KeyL", ["skip", new SkipCommand(10)]],
        ["KeyH", ["skip", new SkipCommand(-20)]],
        ["Semicolon", ["skip", new SkipCommand(20)]], // ;
        ["ArrowDown", ["volume", new VolumeCommand(-0.05)]],
        ["ArrowUp", ["volume", new VolumeCommand(0.05)]],
        ["BracketLeft", ["episode", new EpisodeCommand(false)]], // [
        ["BracketRight", ["episode", new EpisodeCommand(true)]], // ]
        ["Digit0", ["seek", new SeekCommand(0.0)]], //  0%
        ["Digit1", ["seek", new SeekCommand(0.1)]], // 10%
        ["Digit2", ["seek", new SeekCommand(0.2)]], // 20%
        ["Digit3", ["seek", new SeekCommand(0.3)]], // 30%
        ["Digit4", ["seek", new SeekCommand(0.4)]], // 40%
        ["Digit5", ["seek", new SeekCommand(0.5)]], // 50%
        ["Digit6", ["seek", new SeekCommand(0.6)]], // 60%
        ["Digit7", ["seek", new SeekCommand(0.7)]], // 70%
        ["Digit8", ["seek", new SeekCommand(0.8)]], // 80%
        ["Digit9", ["seek", new SeekCommand(0.9)]], // 90%
    ]);

    private static command(code: string, shift: boolean): Command | undefined {
        let context = HotKeyManager.context;

        if (!context)
            return undefined;

        let cmd = shift ? this._hotkeyMapShift.get(code) : this._hotkeyMapNoShift.get(code);
        if (!cmd)
            return undefined;

        if (!context.allowedCommands.includes(cmd[0]))
            return undefined;

        cmd[1].context = context;
        return cmd[1];
    }
}