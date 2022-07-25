import { Settings } from "../Settings";
import { Log } from "../Utils/Log";
import { Selector } from "./Selector";

export abstract class Video {
    selectors: Selector[];

    // Selectors with iframe must come first because top window always exists
    constructor(selectors: Selector[]) {
        if (selectors.length == 0)
            throw new Error("empty selectors");
        this.selectors = selectors;
    }

    get iframe(): HTMLIFrameElement | null {
        for (let selector of this.selectors) {
            if (selector.iframe) {
                let iframe = document.querySelector<HTMLIFrameElement>(selector.iframe);
                if (iframe) {
                    if (Settings.verboseLog)
                        console.debug(Log.format(`hit iframe, selector ${selector.iframe}`));
                    return iframe;
                }
            }
            else {
                if (Settings.verboseLog)
                    console.debug(Log.format("non iframe"));
                return null;
            }
        }
        return null;
    }

    get window(): Window | null {
        for (let selector of this.selectors) {
            if (selector.iframe) {
                let iframe = document.querySelector<HTMLIFrameElement>(selector.iframe);
                if (iframe) {
                    if (Settings.verboseLog)
                        console.debug(Log.format(`hit iframe window, selector ${selector.iframe}`));
                    return iframe.contentWindow;
                }
            }
            else {
                // The window object below may refer to the topmost window or an iframe window,
                // depending on where this code is running.

                // In manifest.json, we don't enable all_frames for the content script,
                // so the extension runs always in topmost windows.

                // But we also inject script to the video containing document, which may be within an iframe.
                // In this case, the subclass NativeVideo is instantiated in the injected code,
                // and the window object below will end up refer to an iframe window.
                if (Settings.verboseLog)
                    console.debug(Log.format("hit top window"));
                return window;
            }
        }
        return null;
    }

    get document(): Document | null {
        return this.window?.document ?? null;
    }

    get element(): HTMLVideoElement | null {
        for (let selector of this.selectors) {
            if (selector.iframe) {
                let iframe = document.querySelector<HTMLIFrameElement>(selector.iframe);
                if (iframe) {
                    let elem = iframe.contentDocument?.querySelector<HTMLVideoElement>(selector.element);

                    if (elem) {
                        if (Settings.verboseLog)
                            console.debug(Log.format(`hit iframe element, selector ${selector.iframe}|${selector.element}`));
                        return elem;
                    }

                    if (Settings.verboseLog)
                        console.debug(Log.format(`missed iframe element, selector ${selector.iframe}|${selector.element}`));
                    return null;
                }
            }
            else {
                let elem = document.querySelector<HTMLVideoElement>(selector.element);

                if (elem) {
                    if (Settings.verboseLog)
                        console.debug(Log.format(`hit top window element, selector ${selector.element}`));
                    return elem;
                }

                if (Settings.verboseLog)
                    console.debug(Log.format(`missed top window element, selector ${selector.element}`));
                return null;
            }
        }
        return null;
    }

    get container(): HTMLElement | null {
        return this.element?.parentElement ?? null;
    }

    $<E extends HTMLElement = HTMLElement>(selectors: string): E | null {
        return this.document?.querySelector<E>(selectors) ?? null;
    }

    abstract hasInited(doc: Document): boolean;
    abstract init(doc: Document): void;

    // Attributes
    abstract readyState(): Promise<number | null>;

    // Control
    abstract play(): Promise<boolean | null>;
    abstract speed(delta: number): Promise<number | null>;
    abstract mute(): Promise<boolean | null>;
    abstract volume(delta: number): Promise<number | null>;
    abstract skip(delta: number): Promise<number | null>;
    abstract seek(pos: number): Promise<number | null>;

    // Status
    abstract playStatus(): Promise<boolean | null>;
    abstract speedStatus(): Promise<number | null>;
    abstract muteStatus(): Promise<boolean | null>;
    abstract volumeStatus(): Promise<number | null>;
    abstract skipStatus(): Promise<number | null>;
    abstract seekStatus(): Promise<number | null>;
}