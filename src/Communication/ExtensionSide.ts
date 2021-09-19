import { Log } from "../Log";
import { CommandType, Payload } from "./Payload";

export class Invoker {
    video: string;

    private playResolve?: (value: boolean) => void;
    private speedResolve?: (value: number) => void;
    private muteResolve?: (value: boolean) => void;
    private volumeResolve?: (value: number) => void;
    private skipResolve?: (value: number) => void;
    private seekResolve?: (value: number) => void;

    private playStatusResolve?: (value: boolean) => void;
    private speedStatusResolve?: (value: number) => void;
    private muteStatusResolve?: (value: boolean) => void;
    private volumeStatusResolve?: (value: number) => void;
    private skipStatusResolve?: (value: number) => void;
    private seekStatusResolve?: (value: number) => void;

    constructor(video: string) {
        this.video = video;

        window.addEventListener("message", ev => {
            // We only accept messages from ourselves
            if (ev.source != window)
                return;

            let data = <Payload>ev.data;
            if (data.to != "VideoHotkeys")
                return;

            if (!data.success) {
                console.error(Log.format("failed in WebPage script:"), data);
                return;
            }

            if (data.type === "set")
                switch (data.command) {
                    case "play":
                        this.playResolve?.call(this, <boolean>data.value);
                        break;
                    case "speed":
                        this.speedResolve?.call(this, <number>data.value);
                        break;
                    case "mute":
                        this.muteResolve?.call(this, <boolean>data.value);
                        break;
                    case "volume":
                        this.volumeResolve?.call(this, <number>data.value);
                        break;
                    case "skip":
                        this.skipResolve?.call(this, <number>data.value);
                        break;
                    case "seek":
                        this.seekResolve?.call(this, <number>data.value);
                        break;
                }
            else
                switch (data.command) {
                    case "play":
                        this.playStatusResolve?.call(this, <boolean>data.value);
                        break;
                    case "speed":
                        this.speedStatusResolve?.call(this, <number>data.value);
                        break;
                    case "mute":
                        this.muteStatusResolve?.call(this, <boolean>data.value);
                        break;
                    case "volume":
                        this.volumeStatusResolve?.call(this, <number>data.value);
                        break;
                    case "skip":
                        this.skipStatusResolve?.call(this, <number>data.value);
                        break;
                    case "seek":
                        this.seekStatusResolve?.call(this, <number>data.value);
                        break;
                }
        }, false);
    }

    buildPayload(type: "get" | "set", cmd: CommandType, delta: number): Payload {
        let data: Payload = {
            to: "WebPage",
            type: type,
            video: this.video,
            command: cmd,
            delta: delta,
            success: false,
            value: 0
        };
        return data;
    }

    async play(): Promise<boolean> {
        let promise = new Promise<boolean>(res => {
            this.playResolve = res;
        });

        window.postMessage(this.buildPayload("set", "play", 0), "*");

        return promise;
    }

    async speed(delta: number): Promise<number> {
        let promise = new Promise<number>(res => {
            this.speedResolve = res;
        });

        window.postMessage(this.buildPayload("set", "speed", delta), "*");

        return promise;
    }

    async mute(): Promise<boolean> {
        let promise = new Promise<boolean>(res => {
            this.muteResolve = res;
        });

        window.postMessage(this.buildPayload("set", "mute", 0), "*");

        return promise;
    }

    async volume(delta: number): Promise<number> {
        let promise = new Promise<number>(res => {
            this.volumeResolve = res;
        });

        window.postMessage(this.buildPayload("set", "volume", delta), "*");

        return promise;
    }

    async skip(delta: number): Promise<number> {
        let promise = new Promise<number>(res => {
            this.skipResolve = res;
        });

        window.postMessage(this.buildPayload("set", "skip", delta), "*");

        return promise;
    }

    async seek(pos: number): Promise<number> {
        let promise = new Promise<number>(res => {
            this.seekResolve = res;
        });

        window.postMessage(this.buildPayload("set", "seek", pos), "*");

        return promise;
    }


    async playStatus(): Promise<boolean> {
        let promise = new Promise<boolean>(res => {
            this.playStatusResolve = res;
        });

        window.postMessage(this.buildPayload("get", "play", 0), "*");

        return promise;
    }

    async speedStatus(): Promise<number> {
        let promise = new Promise<number>(res => {
            this.speedStatusResolve = res;
        });

        window.postMessage(this.buildPayload("get", "speed", 0), "*");

        return promise;
    }

    async muteStatus(): Promise<boolean> {
        let promise = new Promise<boolean>(res => {
            this.muteStatusResolve = res;
        });

        window.postMessage(this.buildPayload("get", "mute", 0), "*");

        return promise;
    }

    async volumeStatus(): Promise<number> {
        let promise = new Promise<number>(res => {
            this.volumeStatusResolve = res;
        });

        window.postMessage(this.buildPayload("get", "volume", 0), "*");

        return promise;
    }

    async skipStatus(): Promise<number> {
        let promise = new Promise<number>(res => {
            this.skipStatusResolve = res;
        });

        window.postMessage(this.buildPayload("get", "skip", 0), "*");

        return promise;
    }

    async seekStatus(): Promise<number> {
        let promise = new Promise<number>(res => {
            this.seekStatusResolve = res;
        });

        window.postMessage(this.buildPayload("get", "seek", 0), "*");

        return promise;
    }
}

export async function InjectWebPageScript(video: string): Promise<Invoker> {
    let resolve: (value: Invoker) => void;
    let promise = new Promise<Invoker>((res, _) => { resolve = res; });

    var script = document.createElement("script");
    script.src = chrome.runtime.getURL("comm.js");
    script.onload = function () {
        let invoker = new Invoker(video);
        resolve(invoker);
    };

    (document.head || document.documentElement).appendChild(script);

    return promise;
}
