import { BilibiliVideoProvider } from "./Providers/BilibiliVideoProvider";
import { HotKeyManager } from "./HotKeyManager";
import { IqiyiVideoProvider } from "./Providers/IqiyiVideoProvider";
import { PangzitvVideoProvider } from "./Providers/PangzitvVideoProvider";
import { VideoProvider } from "./Providers/VideoProvider";
import { TencentVideoProvider } from "./Providers/TencentVideoProvider";
import { YoukuVideoProvider } from "./Providers/YoukuVideoProvider";
import { XiguaVideoProvider } from "./Providers/XiguaVideoProvider";
import { MangotvVideoProvider } from "./Providers/MangotvVideoProvider";
import { OlevodVideoProvider } from "./Providers/OlevodVideoProvider";
import { AcFunVideoProvider } from "./Providers/AcFunVideoProvider";

// Test videos:
// https://www.bilibili.com/blackboard/activity-fWxZtdX60h.html
// https://www.bilibili.com/festival/2021bnj
// https://www.bilibili.com/video/BV1Po4y1d7kv
// https://www.bilibili.com/bangumi/play/ss20927
// https://www.pangzitv.com/vod-play-id-20634-src-1-num-1.html
// https://www.iqiyi.com/v_15l8dhqm4qc.html
// https://www.iqiyi.com/a_g1tdbitzkd.html
// https://www.iq.com/play/15jtgp3wjyt
// https://v.qq.com/x/cover/mzc00200w40kuke.html
// https://v.youku.com/v_show/id_XNDY5MzY3NTA4OA==.html
// https://www.ixigua.com/6948269534713217566
// https://w.mgtv.com/b/342285/9487321.html
// https://www.olevod.com/index.php/vod/play/id/26111/sid/1/nid/1.html
// https://www.acfun.cn/v/ac17166696

let providers: VideoProvider[] = [
    new BilibiliVideoProvider(),
    new PangzitvVideoProvider(),
    new IqiyiVideoProvider(),
    new TencentVideoProvider(),
    new YoukuVideoProvider(),
    new XiguaVideoProvider(),
    new MangotvVideoProvider(),
    new OlevodVideoProvider(),
    new AcFunVideoProvider()
];

function main() {
    // fix duplicate domain issue for PangziTV and OleVOD
    if (location.href.startsWith("https://pangzitv.com")
        || location.href.startsWith("https://olevod.com")) {
        location.replace("https://www." + location.href.slice(8));
        return;
    }
    
    let loader = window.setInterval(() => {
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

