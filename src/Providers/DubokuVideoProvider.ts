import { Command } from "../Command";
import { VideoCommands, VideoProvider } from "./VideoProvider";

export class DubokuVideoProvider extends VideoProvider {
    name: string = "Duboku";
    hosts: string[] = ["www.duboku.tv", "tv.gboku.com"];

    get document(): Document {
        return top!.document.querySelector<HTMLIFrameElement>("td#playleft iframe")!.contentDocument!;
    }

    get isReady(): boolean {
        if (this.document.readyState !== "complete")
            return false;

        if (!this.playButton)
            return false;

        return true;
    }

    get isPlayer(): boolean {
        return !!top!.document.querySelector(".myui-player__box td#playleft iframe");
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

    get theaterButton(): HTMLButtonElement | null {
        return null;
    }

    get fullwebpageButton(): HTMLButtonElement | null {
        return null;
    }

    get miniplayerButton(): HTMLButtonElement | null {
        return null;
    }

    get speedMenuItem(): HTMLLIElement | null {
        return this.$(".vjs-menu-content li.vjs-checked");
    }

    commands: VideoCommands = {
        play: this.playCommand(),

        speed: (up: boolean): Command => this.speedCommand(!up),

        fullscreen: this.fullscreenCommand(),

        theater: this.nullCommand(),

        fullwebpage: this.nullCommand(),

        miniplayer: this.nullCommand(),

        danmu: this.nullCommand(),

        mute: this.muteCommand(),

        volume: (delta: number): Command => this.volumeCommand(delta),

        skip: (delta: number): Command => this.skipCommand(delta),

        seek: (pos: number): Command => this.seekCommand(pos),
    };

    async setup(keydownHandler: (event: KeyboardEvent) => void): Promise<void> {
        // register keydown event handler
        top!.document.body.onkeydown = keydownHandler;
        this.document.addEventListener("keydown", keydownHandler, true);

        // auto play video
        let playVideo = window.setInterval(async () => {
            if (await this.commands.play.status()) {
                window.clearInterval(playVideo);

                // clear the speed adjustment menu
                let doc = this.document!;
                let menuHolder = doc.querySelector<HTMLUListElement>(".vjs-menu-speed .vjs-menu-content");
                if (!menuHolder)
                    return;

                for (let i = menuHolder.childNodes.length - 1; i > 0; i--)
                    menuHolder.childNodes[i].remove();

                // update submenu size on extend
                let items = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

                let extendSpeed = doc.querySelector<HTMLLIElement>(".vjs-extend-speed");
                if (extendSpeed) {
                    extendSpeed.onclick = () => {
                        let div = doc.querySelector<HTMLDivElement>(".vjs-menu-div");
                        if (div) {
                            div.style.width = "80px";
                            div.style.height = `${28 * (items.length + 1)}px`;
                        }
                    };
                }

                // recreate the speed adjustment menu
                for (let rate of items) {
                    let li = doc.createElement("li");
                    li.className = "vjs-speed";
                    li.innerHTML = `${rate}x`;

                    if (rate === 1)
                        li.classList.add("vjs-checked");

                    menuHolder.appendChild(li);

                    li.addEventListener("click", () => {
                        this.speedMenuItem?.classList.remove("vjs-checked");
                        let video = this.videoHolder;
                        if (video)
                            video.playbackRate = rate;
                        let span = this.$(".vjs-extend-speed span");
                        if (span)
                            span.innerHTML = li.innerHTML;
                        li.classList.add("vjs-checked");
                    });
                }

                // click default speed
                this.speedMenuItem?.click();

                return;
            }

            await this.commands.play.call();
        }, 300);
    }
}