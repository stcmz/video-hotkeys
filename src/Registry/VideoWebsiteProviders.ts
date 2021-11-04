import { BilibiliVideoProvider } from "../Providers/BilibiliVideoProvider";
import { QiyiVideoProvider } from "../Providers/QiyiVideoProvider";
import { PangziTvVideoProvider } from "../Providers/PangziTvVideoProvider";
import { VideoProvider } from "../Providers/VideoProvider";
import { TencentVideoProvider } from "../Providers/TencentVideoProvider";
import { YoukuVideoProvider } from "../Providers/YoukuVideoProvider";
import { XiguaVideoProvider } from "../Providers/XiguaVideoProvider";
import { MangoTvVideoProvider } from "../Providers/MangoTvVideoProvider";
import { OleVodVideoProvider } from "../Providers/OleVodVideoProvider";
import { AcFunVideoProvider } from "../Providers/AcFunVideoProvider";
import { SohuTvVideoProvider } from "../Providers/SohuTvVideoProvider";
import { VideoWebsiteKeys } from "./VideoWebsites";

type RegistryItem = {
    provider: VideoProvider,
    websites: VideoWebsiteKeys[],
}

/**
 * Map providers to websites where one provider can serve one or more websites
 */
export const VideoWebsiteProviders: { [name: string]: RegistryItem } = {
    AcFun: {
        provider: new AcFunVideoProvider(),
        websites: ["AcFun"],
    },
    Bilibili: {
        provider: new BilibiliVideoProvider(),
        websites: ["Bilibili"],
    },
    MangoTV: {
        provider: new MangoTvVideoProvider(),
        websites: ["MangoTV"],
    },
    OleVOD: {
        provider: new OleVodVideoProvider(),
        websites: ["OleVOD"],
    },
    PangziTV: {
        provider: new PangziTvVideoProvider(),
        websites: ["PangziTV"],
    },
    Qiyi: {
        provider: new QiyiVideoProvider(),
        websites: ["iQiyi", "iQiyiOverseas"],
    },
    SohuTV: {
        provider: new SohuTvVideoProvider(),
        websites: ["SohuTV"],
    },
    TencentVideo: {
        provider: new TencentVideoProvider(),
        websites: ["TencentVideo"],
    },
    XiguaVideo: {
        provider: new XiguaVideoProvider(),
        websites: ["XiguaVideo"],
    },
    Youku: {
        provider: new YoukuVideoProvider(),
        websites: ["Youku"],
    },
};