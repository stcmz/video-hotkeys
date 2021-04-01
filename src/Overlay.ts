const OVERLAY_CLASSNAME = "video-hotkeys-overlay";
const OVERLAY_WRAPPER_CLASSNAME = "video-hotkeys-overlay-wrapper";

export class Overlay {
    private _text: HTMLDivElement;
    private _wrapper: HTMLDivElement;

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

        setTimeout(() => {
            this._wrapper.style.display = "none";
        }, 500);
    }

    static volumeOffIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="48px" height="48px"><path d="M0 0h24v24H0z" fill="none"/><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>`;

    static volumeUpIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="48px" height="48px"><path d="M0 0h24v24H0z" fill="none"/><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>`;
}