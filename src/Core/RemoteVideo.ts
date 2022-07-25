import { Settings } from "../Settings";
import { Log } from "../Utils/Log";
import { CommandName } from "./Command";
import { Payload } from "./Payload";
import { Video } from "./Video";

export class RemoteVideo extends Video {
    static readyStateResolve?: (value: number | null) => void;

    static playResolve?: (value: boolean | null) => void;
    static speedResolve?: (value: number | null) => void;
    static muteResolve?: (value: boolean | null) => void;
    static volumeResolve?: (value: number | null) => void;
    static skipResolve?: (value: number | null) => void;
    static seekResolve?: (value: number | null) => void;

    static playStatusResolve?: (value: boolean | null) => void;
    static speedStatusResolve?: (value: number | null) => void;
    static muteStatusResolve?: (value: boolean | null) => void;
    static volumeStatusResolve?: (value: number | null) => void;
    static skipStatusResolve?: (value: number | null) => void;
    static seekStatusResolve?: (value: number | null) => void;

    static messageHandler(ev: MessageEvent<Payload>): void {
        // We only accept messages from ourselves
        if (ev.data.to != "contentscript")
            return;

        if (Settings.verboseLog)
            console.debug(Log.format(`received ${ev.data.type}-${ev.data.command} result: ${ev.data.result}`));

        switch (ev.data.type) {
            case "ping":
                RemoteVideo.readyStateResolve?.call(null, <number | null>ev.data.result);
                break;
            case "set":
                switch (ev.data.command) {
                    case "play":
                        RemoteVideo.playResolve?.call(null, <boolean | null>ev.data.result);
                        break;
                    case "speed":
                        RemoteVideo.speedResolve?.call(null, <number | null>ev.data.result);
                        break;
                    case "mute":
                        RemoteVideo.muteResolve?.call(null, <boolean | null>ev.data.result);
                        break;
                    case "volume":
                        RemoteVideo.volumeResolve?.call(null, <number | null>ev.data.result);
                        break;
                    case "skip":
                        RemoteVideo.skipResolve?.call(null, <number | null>ev.data.result);
                        break;
                    case "seek":
                        RemoteVideo.seekResolve?.call(null, <number | null>ev.data.result);
                        break;
                }
                break;
            case "get":
                switch (ev.data.command) {
                    case "play":
                        RemoteVideo.playStatusResolve?.call(null, <boolean | null>ev.data.result);
                        break;
                    case "speed":
                        RemoteVideo.speedStatusResolve?.call(null, <number | null>ev.data.result);
                        break;
                    case "mute":
                        RemoteVideo.muteStatusResolve?.call(null, <boolean | null>ev.data.result);
                        break;
                    case "volume":
                        RemoteVideo.volumeStatusResolve?.call(null, <number | null>ev.data.result);
                        break;
                    case "skip":
                        RemoteVideo.skipStatusResolve?.call(null, <number | null>ev.data.result);
                        break;
                    case "seek":
                        RemoteVideo.seekStatusResolve?.call(null, <number | null>ev.data.result);
                        break;
                }
                break;
        }
    }

    private postCommand(type: "get" | "set" | "ping", cmd: CommandName, arg: number): void {
        let window = this.window;

        if (!window)
            throw new Error("no video window");

        // Strip off the iframe selectors and join
        let selector = this.selectors.map(o => o.element).join(", ");

        let data: Payload = {
            to: "webpage",
            type: type,
            selectors: [{ element: selector }],
            command: cmd,
            arg: arg,
            result: 0
        };

        // Post the message to the target window, which contains the video element
        if (Settings.verboseLog)
            console.debug(Log.format(`posting ${data.type}-${data.command} command`));
        window.postMessage(data, "*");
    }

    proxyInjected: boolean = false;

    private static scriptId = "video_hotkeys_proxy";

    hasInited(doc: Document): boolean {
        return !!doc.head.querySelector(`script#${RemoteVideo.scriptId}`);
    }

    init(doc: Document): void {
        // The script will be injected into the video containing document,
        // which is not necessarily the top document.

        if (doc.head.querySelector(`script#${RemoteVideo.scriptId}`)) {
            if (Settings.verboseLog)
                console.debug(Log.format("skipping proxy injection"));
            return;
        }

        console.debug(Log.format("injecting proxy"));

        var script = doc.createElement("script");
        script.id = RemoteVideo.scriptId;
        script.src = chrome.runtime.getURL("proxy.js");

        script.addEventListener("load", async () => {
            console.debug(Log.format("injected proxy"));
            this.proxyInjected = true;

            // Listen to messages sent from the injected script
            window.addEventListener("message", RemoteVideo.messageHandler, false);
        });

        doc.head.appendChild(script);
    }

    async readyState(): Promise<number | null> {
        if (!this.proxyInjected)
            return null;

        let promise = new Promise<number | null>(res => RemoteVideo.readyStateResolve = res);

        this.postCommand("ping", "play" /* unused */, 0);
        return promise;
    }

    async play(): Promise<boolean | null> {
        if (!this.proxyInjected)
            return null;

        let promise = new Promise<boolean | null>(res => RemoteVideo.playResolve = res);

        this.postCommand("set", "play", 0);
        return promise;
    }

    async speed(delta: number): Promise<number | null> {
        if (!this.proxyInjected)
            return null;

        let promise = new Promise<number | null>(res => RemoteVideo.speedResolve = res);

        this.postCommand("set", "speed", delta);
        return promise;
    }

    async mute(): Promise<boolean | null> {
        if (!this.proxyInjected)
            return null;

        let promise = new Promise<boolean | null>(res => RemoteVideo.muteResolve = res);

        this.postCommand("set", "mute", 0);
        return promise;
    }

    async volume(delta: number): Promise<number | null> {
        if (!this.proxyInjected)
            return null;

        let promise = new Promise<number | null>(res => RemoteVideo.volumeResolve = res);

        this.postCommand("set", "volume", delta);
        return promise;
    }

    async skip(delta: number): Promise<number | null> {
        if (!this.proxyInjected)
            return null;

        let promise = new Promise<number | null>(res => RemoteVideo.skipResolve = res);

        this.postCommand("set", "skip", delta);
        return promise;
    }

    async seek(pos: number): Promise<number | null> {
        if (!this.proxyInjected)
            return null;

        let promise = new Promise<number | null>(res => RemoteVideo.seekResolve = res);

        this.postCommand("set", "seek", pos);
        return promise;
    }


    async playStatus(): Promise<boolean | null> {
        if (!this.proxyInjected)
            return null;

        let promise = new Promise<boolean | null>(res => RemoteVideo.playStatusResolve = res);

        this.postCommand("get", "play", 0);
        return promise;
    }

    async speedStatus(): Promise<number | null> {
        if (!this.proxyInjected)
            return null;

        let promise = new Promise<number | null>(res => RemoteVideo.speedStatusResolve = res);

        this.postCommand("get", "speed", 0);
        return promise;
    }

    async muteStatus(): Promise<boolean | null> {
        if (!this.proxyInjected)
            return null;

        let promise = new Promise<boolean | null>(res => RemoteVideo.muteStatusResolve = res);

        this.postCommand("get", "mute", 0);
        return promise;
    }

    async volumeStatus(): Promise<number | null> {
        if (!this.proxyInjected)
            return null;

        let promise = new Promise<number | null>(res => RemoteVideo.volumeStatusResolve = res);

        this.postCommand("get", "volume", 0);
        return promise;
    }

    async skipStatus(): Promise<number | null> {
        if (!this.proxyInjected)
            return null;

        let promise = new Promise<number | null>(res => RemoteVideo.skipStatusResolve = res);

        this.postCommand("get", "skip", 0);
        return promise;
    }

    async seekStatus(): Promise<number | null> {
        if (!this.proxyInjected)
            return null;

        let promise = new Promise<number | null>(res => RemoteVideo.seekStatusResolve = res);

        this.postCommand("get", "seek", 0);
        return promise;
    }
}