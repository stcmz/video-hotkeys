import { BilibiliVideoProvider } from "./Providers/BilibiliVideoProvider";
import { HotKeyManager } from "./HotKeyManager";
import { IqiyiVideoProvider } from "./Providers/IqiyiVideoProvider";
import { PangzitvVideoProvider } from "./Providers/PangzitvVideoProvider";
import { VideoProvider } from "./Providers/VideoProvider";
import { TencentVideoProvider } from "./Providers/TencentVideoProvider";

// Test videos:
// https://www.bilibili.com/festival/2021bnj
// https://www.bilibili.com/video/BV1Po4y1d7kv
// https://www.bilibili.com/bangumi/play/ss20927
// https://www.pangzitv.com/vod-play-id-20634-src-1-num-1.html
// https://www.iqiyi.com/v_15l8dhqm4qc.html
// https://www.iq.com/play/15jtgp3wjyt
// https://v.qq.com/x/cover/mzc00200w40kuke.html

let providers: VideoProvider[] = [
    new BilibiliVideoProvider(),
    new PangzitvVideoProvider(),
    new IqiyiVideoProvider(),
    new TencentVideoProvider()
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

