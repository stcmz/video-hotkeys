import volumeOff from "../assets/volume_off_white_48dp.svg"
import volumeUp from "../assets/volume_up_white_48dp.svg"

const OVERLAY_CLASSNAME = "video-hotkeys-overlay";
const OVERLAY_WRAPPER_CLASSNAME = "video-hotkeys-overlay-wrapper";

export class Overlay {
    private _text: HTMLDivElement;
    private _wrapper: HTMLDivElement;
    private _timeout: number = 0;

    constructor(container: HTMLDivElement) {
        let wrapDiv = document.createElement("div");
        wrapDiv.className = OVERLAY_WRAPPER_CLASSNAME;
        wrapDiv.style.position = "absolute";
        wrapDiv.style.width = "100%";
        wrapDiv.style.top = "0";
        wrapDiv.style.marginTop = "15%";
        wrapDiv.style.zIndex = "100";
        wrapDiv.style.textAlign = "center";
        wrapDiv.style.display = "none";

        let textDiv = document.createElement("div");
        textDiv.className = OVERLAY_CLASSNAME;
        textDiv.style.display = "inline-block";
        textDiv.style.background = "rgba(0,0,0,0.5)";
        textDiv.style.color = "#fff";
        textDiv.style.padding = "10px 20px";
        textDiv.style.borderRadius = "3px";
        textDiv.style.fontSize = "175%";

        wrapDiv.appendChild(textDiv);

        let text = document.createTextNode("1.0x");
        textDiv.appendChild(text);

        container.appendChild(wrapDiv);

        this._wrapper = wrapDiv;
        this._text = textDiv;
    }

    show(html: string): void {
        this._text.innerHTML = html;
        this._wrapper.style.display = "";

        window.clearTimeout(this._timeout);

        this._timeout = window.setTimeout(() => {
            this._wrapper.style.display = "none";
        }, 500);
    }

    static volumeOffIcon = volumeOff;
    static volumeUpIcon = volumeUp;

    static danmuOnText = "弹幕开启";
    static danmuOffText = "弹幕关闭";
}