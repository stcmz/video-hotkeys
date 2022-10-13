import { HotKeyManager } from "./Core/HotKeyManager";
import { PlayerContext } from "./Core/PlayerContext";
import { Log } from "./Utils/Log";
import { Settings } from "./Settings";
import { PlayerContextManager } from "./Core/PlayerContextManager";

Log.context = "contentscript";

// No playlist test
// https://www.pangzitv.com/vod-play-id-101385-src-1-num-1.html
// https://www.acfun.cn/v/ac17166696
// https://tv.sohu.com/v/dXMvMzI0MjUzNjQwLzM2Nzc1NDgxMy5zaHRtbA==.html
// https://w.mgtv.com/b/367750/13822701.html
// https://www.ixigua.com/6987717837024395789
// https://www.iqiyi.com/v_15l8dhqm4qc.html
// https://v.qq.com/x/page/z33482ddk3c.html
// https://v.youku.com/v_show/id_XNDk3NjUyNTQ0NA==.html
// https://www.youtube.com/watch?v=EguDDKPYyX4
// https://www.bilibili.com/blackboard/activity-fWxZtdX60h.html
// https://www.bilibili.com/blackboard/activity-9wgNIgvSLi.html (weak experience)
// https://www.bilibili.com/video/BV1Po4y1d7kv

// Playlist test
// https://www.pangzitv.com/vod-play-id-20634-src-1-num-1.html
// https://www.olevod.com/index.php/vod/play/id/36151/sid/1/nid/1.html
// https://tv.gboku.com/vodplay/2373-1-1.html
// https://www.acfun.cn/bangumi/aa6065467_36188_1884948
// https://tv.sohu.com/v/MjAyMTAyMTAvbjYwMDk4MDM2OC5zaHRtbA==.html
// https://tv.sohu.com/v/MjAyMTA2MTYvbjYwMTAxOTQ4Ni5zaHRtbA==.html
// https://w.mgtv.com/b/454114/16606914.html
// https://www.ixigua.com/6678853713890640392
// https://www.ixigua.com/6871526996371833358
// https://www.ixigua.com/6543792564565180941
// https://www.iqiyi.com/a_g1tdbitzkd.html
// https://www.iqiyi.com/a_symikuowtl.html
// https://www.iq.com/play/15jtgp3wjyt
// https://v.qq.com/x/cover/mzc00200prhhvrv/g00437z9au2.html
// https://v.qq.com/x/cover/mzc00200iac0ef2/z0043zsv94p.html
// https://v.qq.com/x/cover/mzc00200w40kuke.html
// https://v.youku.com/v_show/id_XNTE5NDQxMjc5Ng==.html
// https://v.youku.com/v_show/id_XNDY5MzY3NTA4OA==.html
// https://www.youtube.com/watch?v=DI39ZGOLSYg&list=PLWJWeJT_v21uucMrB6Q_kcB0Tg2hBcoV7&index=3
// https://www.bilibili.com/bangumi/play/ep416153
// https://www.bilibili.com/bangumi/play/ep422437
// https://www.bilibili.com/festival/2021bnj
// https://www.bilibili.com/video/BV1BU4y1X71R


let onTopDocumentFoundCalled = false;
let onInnerDocumentFoundCalled = false;
let iframeLoadedListened = false;
let onVideoReadyCalled = false;
let canplayListened = false;
let onSignalListened = false;

async function videoCanPlay() {
    const video = HotKeyManager.context!.video.element;

    if (!video) {
        console.warn(Log.format("cannot locate video elem"));
        return;
    }

    if (video && !onVideoReadyCalled) {
        console.info(Log.format(`video ready, readyState: ${video.readyState}`));

        onVideoReadyCalled = true;
        await HotKeyManager.onVideoReady();
    }

    if (onVideoReadyCalled) {
        if (Settings.verboseLog)
            console.debug(Log.format("unlistening canplay"));

        video.ownerDocument.removeEventListener("canplay", videoCanPlay, true);

        if (!onSignalListened) {
            const signal = setInterval(async () => {
                try {
                    if (await HotKeyManager.onSignal()) {
                        clearInterval(signal);
                    }
                } catch (e) {
                    clearInterval(signal);
                }
            }, 300);

            onSignalListened = true;
        }
    }
}

async function initVideo(context: PlayerContext, videoDoc: Document) {
    if (Settings.verboseLog)
        console.debug(Log.format(`initializing video on ${videoDoc == document ? "top" : "iframe"} document`));
    context.video.init(videoDoc);

    if (!canplayListened) {
        if (videoDoc.URL == "about:blank") {
            console.debug(Log.format("blank document"));
            return;
        }

        if (Settings.verboseLog)
            console.debug(Log.format("listening canplay"));

        videoDoc.addEventListener("canplay", videoCanPlay, true);
        canplayListened = true;
    }
}

async function initDocuments(context: PlayerContext) {
    const win = context.video.window;

    if (!win) {
        console.info(Log.format("no video window"));
        return;
    }

    // Found a top document
    if (!onTopDocumentFoundCalled) {
        console.debug(Log.format(`found top document, readyState: ${document.readyState}`));

        HotKeyManager.onDocumentFound(document);
        onTopDocumentFoundCalled = true;
    }

    // For iframe content document
    if (win != window) {
        if (Settings.verboseLog)
            console.debug(Log.format("video in iframe window"));

        const iframe = context.video.iframe;
        if (!iframe)
            throw new Error("no iframe");

        const videoDoc = iframe.contentDocument;

        if (videoDoc) {
            if (!iframeLoadedListened) {
                if (videoDoc.URL == "about:blank") {
                    console.debug(Log.format("blank iframe document"));
                    return;
                }

                if (Settings.verboseLog)
                    console.debug(Log.format("listening load"));

                iframe.addEventListener("load", async () => {
                    if (Settings.verboseLog)
                        console.info(Log.format("load triggered"));

                    // Found an iframe document
                    if (!onInnerDocumentFoundCalled) {
                        console.info(Log.format(`found iframe document onload, readyState: ${videoDoc.readyState}, URL: ${videoDoc.URL}`));

                        HotKeyManager.onDocumentFound(videoDoc);
                        onInnerDocumentFoundCalled = true;
                    }

                    await initVideo(context, videoDoc);
                }, true);

                iframeLoadedListened = true;
            }

            if (videoDoc.URL.startsWith("http")
                && (videoDoc.readyState == "interactive" || videoDoc.readyState == "complete")) {
                // Found an iframe document
                if (!onInnerDocumentFoundCalled) {
                    console.info(Log.format(`found iframe document, readyState: ${videoDoc.readyState}, URL: ${videoDoc.URL}`));

                    HotKeyManager.onDocumentFound(videoDoc);
                    onInnerDocumentFoundCalled = true;
                }

                await initVideo(context, videoDoc);
            }
        }
    }
    else {
        console.debug(Log.format("video in top window"));

        await initVideo(context, document);
    }
}

async function main() {
    console.debug(Log.format("starting"));

    const context = PlayerContextManager.matchByHostname(location.hostname);

    if (!context) {
        console.info(Log.format("no player detected"));
        return;
    }

    console.info(Log.format(`detected ${context.name} player`));

    HotKeyManager.context = context;

    // Stage 1: The readyState of the video-containing document becomes interactive or complete
    //   We inject scripts and set up hotkey hook.
    //   The hotkey handler will determine if the video is ready before proceeding the command.
    // Stage 2: The readyState of the video becomes 2 (HAVE_CURRENT_DATA)
    //   We auto play the video.

    document.addEventListener("readystatechange", async () => {
        if (document.readyState == "interactive" || document.readyState == "complete") {
            if (Settings.verboseLog)
                console.debug(Log.format(`init documents on readystatechange, readyState: ${document.readyState}`));

            await initDocuments(context);
        }
    }, true);

    if (document.readyState == "interactive" || document.readyState == "complete") {
        if (Settings.verboseLog)
            console.debug(Log.format(`init documents, readyState: ${document.readyState}`));

        await initDocuments(context);
    }
}

main();