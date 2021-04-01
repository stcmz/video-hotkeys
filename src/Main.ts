import { BiliProvider } from "./BiliProvider";
import { HotKeyManager } from "./HotKeyManager";
import { PangziProvider } from "./PangziProvider";
import { VideoProvider } from "./VideoProvider";

// Test videos:
// https://www.bilibili.com/festival/2021bnj
// https://www.bilibili.com/video/BV1Po4y1d7kv
// https://www.bilibili.com/bangumi/play/ss20927
// https://www.pangzitv.com/vod-play-id-20634-src-1-num-1.html

let providers: VideoProvider[] = [
    new BiliProvider(),
    new PangziProvider(),
];

function main() {
    let loader = setInterval(() => {
        // wait until top document is ready
        if (top.document.readyState !== "complete")
            return;
        clearInterval(loader);

        // match a video provider
        let found = false;
        for (let provider of providers) {
            if (provider.isPlayer) {
                console.debug(`[video-hotkeys] detected ${provider.name} player`);
                HotKeyManager.setVideoProvider(provider);
                found = true;
                break;
            }
        }

        // nothing to do, exiting
        if (!found) {
            console.debug("[video-hotkeys] no video player detected");
        }
    }, 300);
}

main();

