import { BilibiliVideoProvider } from "./Providers/BilibiliVideoProvider";
import { HotKeyManager } from "./HotKeyManager";
import { QiyiVideoProvider } from "./Providers/QiyiVideoProvider";
import { PangziTvVideoProvider } from "./Providers/PangziTvVideoProvider";
import { VideoProvider } from "./Providers/VideoProvider";
import { TencentVideoProvider } from "./Providers/TencentVideoProvider";
import { YoukuVideoProvider } from "./Providers/YoukuVideoProvider";
import { XiguaVideoProvider } from "./Providers/XiguaVideoProvider";
import { MangoTvVideoProvider } from "./Providers/MangoTvVideoProvider";
import { OleVodVideoProvider } from "./Providers/OleVodVideoProvider";
import { AcFunVideoProvider } from "./Providers/AcFunVideoProvider";
import { SohuTvVideoProvider } from "./Providers/SohuTvVideoProvider";
import { Log } from "./Log";

// Test videos:
// https://www.bilibili.com/blackboard/activity-fWxZtdX60h.html
// https://www.bilibili.com/festival/2021bnj
// https://www.bilibili.com/video/BV1Po4y1d7kv
// https://www.bilibili.com/bangumi/play/ep416153
// https://www.pangzitv.com/vod-play-id-20634-src-1-num-1.html
// https://www.iqiyi.com/v_15l8dhqm4qc.html
// https://www.iqiyi.com/a_g1tdbitzkd.html
// https://www.iq.com/play/15jtgp3wjyt
// https://v.qq.com/x/cover/mzc00200w40kuke.html
// https://v.youku.com/v_show/id_XNDY5MzY3NTA4OA==.html
// https://www.ixigua.com/6987717837024395789
// https://w.mgtv.com/b/367750/13822701.html
// https://www.olevod.com/index.php/vod/play/id/26111/sid/1/nid/1.html
// https://www.acfun.cn/v/ac17166696
// https://tv.sohu.com/v/MjAyMTAyMTAvbjYwMDk4MDM2OC5zaHRtbA==.html

let providers: VideoProvider[] = [
    new BilibiliVideoProvider(),
    new PangziTvVideoProvider(),
    new QiyiVideoProvider(),
    new TencentVideoProvider(),
    new YoukuVideoProvider(),
    new XiguaVideoProvider(),
    new MangoTvVideoProvider(),
    new OleVodVideoProvider(),
    new AcFunVideoProvider(),
    new SohuTvVideoProvider(),
];

function main() {
    console.debug(Log.format("starting"));

    // fix duplicate domain issue for PangziTV and OleVOD
    if (location.href.startsWith("https://pangzitv.com")
        || location.href.startsWith("https://olevod.com")) {
        location.replace("https://www." + location.href.slice(8));
        return;
    }

    Log.context = "contentscript";

    let loader = window.setInterval(() => {
        // wait until top document is ready
        if (top!.document.readyState !== "complete")
            return;
        clearInterval(loader);

        // match a video provider
        let found = false;
        for (let provider of providers) {
            if (provider.isPlayer) {
                console.debug(Log.format(`detected ${provider.name} player`));

                HotKeyManager.setVideoProvider(provider);
                found = true;
                break;
            }
        }

        // nothing to do, exiting
        if (!found) {
            console.debug(Log.format("no video player detected"));
        }
    }, 300);
}

main();

