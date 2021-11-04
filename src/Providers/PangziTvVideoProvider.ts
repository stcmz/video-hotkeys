import { VideoProvider } from "./VideoProvider";


export class PangziTvVideoProvider extends VideoProvider {
    get document(): Document {
        return top.document.querySelector<HTMLIFrameElement>(".videohtmlclass")!.contentDocument!;
    }

    get isReady(): boolean {
        if (top.document.readyState !== "complete")
            return false;

        let doc = this.document;
        if (!doc || doc.readyState !== "complete")
            return false;

        return true;
    }

    get isPlayer(): boolean {
        return !!top.document.querySelector("#playleft")
            && !!top.document.querySelector<HTMLIFrameElement>(".videohtmlclass")?.contentDocument;
    }

    get videoHolder(): HTMLVideoElement | null {
        return this.$(".video-js video");
    }

    get overlayHolder(): HTMLDivElement | null {
        return this.$(".video-js");
    }

    get playButton(): HTMLButtonElement | null {
        return this.$(".vjs-play-control");
    }

    get fullscreenButton(): HTMLButtonElement | null {
        return this.$(".vjs-fullscreen-control");
    }

    get speedMenuItem(): HTMLLIElement | null {
        return this.$(".vjs-playback-rate .vjs-menu-item.vjs-selected");
    }

    setup(keydownHandler: (event: KeyboardEvent) => void): void {
        // register keydown event handler
        top.document.onkeydown = keydownHandler;

        let doc = this.document!;
        doc.onkeydown = keydownHandler;

        // clear the speed adjustment menu
        let menuHolder = doc.querySelector<HTMLUListElement>(".vjs-playback-rate .vjs-menu-content");
        if (!menuHolder)
            return;

        menuHolder.innerHTML = "";

        // recreate the speed adjustment menu
        let items = [2, 1.75, 1.5, 1.25, 1, 0.75];

        let attr = (name: string, value: string): Attr => {
            let a = doc.createAttribute(name);
            a.value = value;
            return a;
        };

        for (let rate of items) {
            let li = doc.createElement("li");
            li.className = "vjs-menu-item";
            li.tabIndex = -1;
            li.attributes.setNamedItem(attr("role", "menuitemcheckbox"));
            li.attributes.setNamedItem(attr("aria-live", "polite"));
            li.attributes.setNamedItem(attr("aria-disabled", "false"));
            li.attributes.setNamedItem(attr("aria-checked", "false"));
            li.innerHTML = `${rate}x <span class="vjs-control-text"> </span>`;

            if (rate === 1)
                li.classList.add("vjs-selected");

            menuHolder.appendChild(li);

            li.addEventListener("click", () => {
                this.speedMenuItem?.classList.remove("vjs-selected");
                let video = this.videoHolder;
                if (video)
                    video.playbackRate = rate;
                li.classList.add("vjs-selected");
            });
        }

        // disable speed adjustment on button click
        let speedAdjustButton = doc.querySelector<HTMLButtonElement>(".vjs-playback-rate-value");
        speedAdjustButton?.addEventListener("click", ev => ev.stopPropagation());
    }
}