export enum VideoWebsites {
    AcFun,
    Bilibili,
    MangoTV,
    OleVOD,
    PangziTV,
    iQiyi,
    iQiyiOverseas,
    SohuTV,
    TencentVideo,
    XiguaVideo,
    Youku,
}

export type VideoWebsiteKeys = keyof typeof VideoWebsites;

type RegistryItem = {
    url: string,
    altUrl?: string,
    obsoleteUrl?: string,
}

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
// https://tv.sohu.com/v/MjAyMTAyMTAvbjYwMDk4MDM2OC5zaHRtbA==.html
// https://baike.baidu.com/item/%E6%B0%B4%E5%85%89%E9%92%88/15704135

export let VideoWebsiteUrls: { [name in VideoWebsiteKeys]: RegistryItem } = {
    AcFun: {
        url: "https://www.acfun.cn/"
    },
    Bilibili: {
        url: "https://www.bilibili.com/",
    },
    MangoTV: {
        url: "https://w.mgtv.com/",
    },
    OleVOD: {
        url: "https://www.olevod.com/",
        obsoleteUrl: "https://olevod.com/",
    },
    PangziTV: {
        url: "https://www.pangzitv.com/",
        altUrl: "https://m.pangzitv.com/",
        obsoleteUrl: "https://pangzitv.com/",
    },
    iQiyi: {
        url: "https://www.iqiyi.com/",
    },
    iQiyiOverseas: {
        url: "https://www.iq.com/",
    },
    SohuTV: {
        url: "https://tv.sohu.com/",
    },
    TencentVideo: {
        url: "https://v.qq.com/",
    },
    XiguaVideo: {
        url: "https://www.ixigua.com/",
    },
    Youku: {
        url: "https://v.youku.com/",
    },
};