import volumeOff from "../Assets/volume_off_white_48dp.svg"
import volumeUp from "../Assets/volume_up_white_48dp.svg"

const OVERLAY_CLASSNAME = "video-hotkeys-overlay";
const OVERLAY_WRAPPER_CLASSNAME = "video-hotkeys-overlay-wrapper";

export class Overlay {
    private _text: HTMLElement;
    private _wrapper: HTMLElement;
    private _timeout: number = 0;
    private _doc: Document;

    constructor(container: HTMLElement) {
        this._doc = container.ownerDocument;

        let wrapDiv = this._doc.createElement("div");
        wrapDiv.className = OVERLAY_WRAPPER_CLASSNAME;
        wrapDiv.style.position = "absolute";
        wrapDiv.style.width = "100%";
        wrapDiv.style.top = "0";
        wrapDiv.style.marginTop = "15%";
        wrapDiv.style.zIndex = "1000";
        wrapDiv.style.textAlign = "center";
        wrapDiv.style.lineHeight = "1";
        wrapDiv.style.display = "none";

        let textDiv = this._doc.createElement("div");
        textDiv.className = OVERLAY_CLASSNAME;
        textDiv.style.display = "inline-block";
        textDiv.style.background = "rgba(0,0,0,0.5)";
        textDiv.style.color = "#fff";
        textDiv.style.padding = "10px 20px";
        textDiv.style.borderRadius = "3px";
        textDiv.style.lineHeight = "1";
        textDiv.style.fontSize = "20px";
        textDiv.style.fontFamily = "Arial, sans-serif";

        wrapDiv.appendChild(textDiv);

        let text = this._doc.createTextNode("1.0x");
        textDiv.appendChild(text);

        container.appendChild(wrapDiv);

        this._wrapper = wrapDiv;
        this._text = textDiv;
    }

    show(html: string, duration: number): void {
        this._text.innerHTML = html;
        this._wrapper.style.display = "";

        window.clearTimeout(this._timeout);

        this._timeout = window.setTimeout(() => {
            this._wrapper.style.display = "none";
        }, duration);
    }

    get valid(): boolean {
        return !!this._doc.querySelector(`.${OVERLAY_WRAPPER_CLASSNAME}`);
    }

    static volumeOffIcon: string = volumeOff;
    static volumeUpIcon: string = volumeUp;

    static danmuOnText: string = chrome.i18n.getMessage("danmu_on");
    static danmuOffText: string = chrome.i18n.getMessage("danmu_off");
}