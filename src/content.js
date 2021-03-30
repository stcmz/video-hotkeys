const BILI_SPEED_ADJUST_SELECTOR = ".bilibili-player-video-btn-speed-menu-list.bilibili-player-active";
const PANGZI_SPEED_ADJUST_SELECTOR = ".vjs-playback-rate .vjs-menu-item.vjs-selected";
const PANGZI_SPEED_ADJUST_MENU_SELECTOR = ".vjs-playback-rate .vjs-menu-content";
const PANGZI_CURRENT_SPEED_SELECTOR = ".vjs-playback-rate-value";
const BILI_PLAY_CONTROL_SELECTOR = ".bilibili-player-video-btn-start button";
const PANGZI_PLAY_CONTROL_SELECTOR = ".vjs-play-control";
const BILI_FULLSCREEN_CONTROL_SELECTOR = ".bilibili-player-iconfont-fullscreen-off";
const PANGZI_FULLSCREEN_CONTROL_SELECTOR = ".vjs-fullscreen-control";
const BILI_DANMU_SWITCH_SELECTOR = ".bilibili-player-video-danmaku-switch .bui-switch-input";
const BILI_IS_VIDEO_PLAYER_TEST_SELECTOR = "#bilibiliPlayer";
const PANGZI_IS_VIDEO_PLAYER_TEST_SELECTOR = ".videohtmlclass";
const BILI_VIDEO_PLAYER_SELECTOR = ".bilibili-player-video video";
const PANGZI_VIDEO_PLAYER_SELECTOR = ".video-js video";
const BILI_VIDEO_PLAYER_WRAPPER_SELECTOR = ".bilibili-player-video-wrap";
const PANGZI_VIDEO_PLAYER_WRAPPER_SELECTOR = ".video-js";
const BILI_VIDEO_PLAYER_READY_TEST_SELECTOR = ".bilibili-player-video-panel-text .bilibili-player-video-panel-row";

const BEZEL_CLASSNAME = "video-hotkeys-bezel";
const BEZEL_WRAPPER_CLASSNAME = "video-hotkeys-bezel-wrapper";
const DANMU_ON_TEXT = "弹幕开启";
const DANMU_OFF_TEXT = "弹幕关闭";

let site = null;

// test videos:
// https://www.bilibili.com/festival/2021bnj
// https://www.bilibili.com/video/BV1Po4y1d7kv
// https://www.bilibili.com/bangumi/play/ss20927
// https://www.pangzitv.com/vod-play-id-20634-src-1-num-1.html

function showhint(doc, text) {
    doc.querySelector(`.${BEZEL_CLASSNAME}`).textContent = text;
    doc.querySelector(`.${BEZEL_WRAPPER_CLASSNAME}`).style.display = "";
    setTimeout(function () {
        doc.querySelector(`.${BEZEL_WRAPPER_CLASSNAME}`).style.display = "none";
    }, 500);
}

function keyhook(ev) {
    if (document.activeElement.tagName === "INPUT"
        || document.activeElement.tagName === "TEXTAREA"
        || document.activeElement.tagName === "SELECT"
        || ev.altKey || ev.ctrlKey)
        return;

    let doc = null;
    if (site === "bili")
        doc = top.document;
    else if (site === "pangzi")
        doc = top.document.querySelector(PANGZI_IS_VIDEO_PLAYER_TEST_SELECTOR).contentDocument;

    if (doc.activeElement.tagName === "INPUT"
        || doc.activeElement.tagName === "TEXTAREA"
        || doc.activeElement.tagName === "SELECT")
        return;

    if (ev.key === 'd' || ev.key === 'D') {
        if (site === "bili") {
            doc.querySelector(BILI_DANMU_SWITCH_SELECTOR).click();
            showhint(doc, doc.querySelector(BILI_DANMU_SWITCH_SELECTOR).checked ? DANMU_ON_TEXT : DANMU_OFF_TEXT);
        }
    }
    if (ev.key === 'f' || ev.key === 'F') {
        if (site === "bili")
            doc.querySelector(BILI_FULLSCREEN_CONTROL_SELECTOR).click();
        else if (site === "pangzi")
            doc.querySelector(PANGZI_FULLSCREEN_CONTROL_SELECTOR).click();
    }
    else if (ev.key === ' ') {
        if (site === "bili")
            doc.querySelector(BILI_PLAY_CONTROL_SELECTOR).click();
        else if (site === "pangzi")
            doc.querySelector(PANGZI_PLAY_CONTROL_SELECTOR).click();
    }
    else if (ev.key === '<') {
        if (site === "bili") {
            let next = doc.querySelector(BILI_SPEED_ADJUST_SELECTOR).nextSibling;
            if (next && next.click)
                next.click();
            showhint(doc, doc.querySelector(BILI_SPEED_ADJUST_SELECTOR).textContent);
        }
        else if (site === "pangzi") {
            let next = doc.querySelector(PANGZI_SPEED_ADJUST_SELECTOR).nextSibling;
            if (next && next.click)
                next.click();
            showhint(doc, `${doc.querySelector(PANGZI_VIDEO_PLAYER_SELECTOR).playbackRate}x`);
        }
    }
    else if (ev.key === '>') {
        if (site === "bili") {
            let prev = doc.querySelector(BILI_SPEED_ADJUST_SELECTOR).previousSibling;
            if (prev && prev.click)
                prev.click();
            showhint(doc, doc.querySelector(BILI_SPEED_ADJUST_SELECTOR).textContent);
        }
        else if (site === "pangzi") {
            let prev = doc.querySelector(PANGZI_SPEED_ADJUST_SELECTOR).previousSibling;
            if (prev && prev.click)
                prev.click();
            showhint(doc, `${doc.querySelector(PANGZI_VIDEO_PLAYER_SELECTOR).playbackRate}x`);
        }
    }
    else if ('0' <= ev.key && ev.key <= '9') {
        if (site === "bili") {
            let video = doc.querySelector(BILI_VIDEO_PLAYER_SELECTOR);
            video.currentTime = (ev.key.charCodeAt(0) - "0".charCodeAt(0)) * video.duration / 10;
        }
        else if (site === "pangzi") {
            let video = doc.querySelector(PANGZI_VIDEO_PLAYER_SELECTOR);
            video.currentTime = (ev.key.charCodeAt(0) - "0".charCodeAt(0)) * video.duration / 10;
        }
    }
    else {
        return true;
    }
    return false;
}

function init_bili() {
    let loader = setInterval(function () {
        if (document.readyState !== "complete"
            || !document.querySelector(BILI_VIDEO_PLAYER_SELECTOR)
            || document.querySelector(BILI_VIDEO_PLAYER_SELECTOR).readyState === 0
            || !document.querySelector(BILI_PLAY_CONTROL_SELECTOR)
            || ![...document.querySelectorAll(BILI_VIDEO_PLAYER_READY_TEST_SELECTOR)].every(o => o.textContent.substr(-4) === "[完成]")) {
            return;
        }
        clearInterval(loader);

        document.onkeypress = keyhook;

        let pdiv = document.createElement("DIV");
        pdiv.className = BEZEL_WRAPPER_CLASSNAME;
        pdiv.style = `position:absolute;width:100%;top:0;margin-top:15%;z-index:100;text-align:center;display:none`;

        let tdiv = document.createElement("DIV");
        tdiv.className = BEZEL_CLASSNAME;
        tdiv.style = `display:inline-block;background:rgba(0,0,0,0.5);color:#fff;padding:10px 20px;border-radius:3px;font-size:175%`;
        pdiv.appendChild(tdiv);

        let text = document.createTextNode("1.0x");
        tdiv.appendChild(text);
        document.querySelector(BILI_VIDEO_PLAYER_WRAPPER_SELECTOR).appendChild(pdiv);

        // auto play video
        let video = document.querySelector(BILI_VIDEO_PLAYER_SELECTOR);
        if (video.paused)
            video.click();

        // auto hide danmu
        if (document.querySelector(BILI_DANMU_SWITCH_SELECTOR).checked)
            document.querySelector(BILI_DANMU_SWITCH_SELECTOR).click();

        console.debug("video-hotkeys loaded for Bilibili");
    }, 300);
}

function init_pangzi() {
    let loader = setInterval(function () {
        if (top.document.readyState !== "complete")
            return;

        let doc = top.document.querySelector(PANGZI_IS_VIDEO_PLAYER_TEST_SELECTOR).contentDocument;
        if (doc.readyState !== "complete"
            || !doc.querySelector(PANGZI_VIDEO_PLAYER_SELECTOR)
            || doc.querySelector(PANGZI_VIDEO_PLAYER_SELECTOR).readyState === 0
            || !doc.querySelector(PANGZI_PLAY_CONTROL_SELECTOR)) {
            return;
        }
        clearInterval(loader);

        top.document.onkeypress = keyhook;
        doc.onkeypress = keyhook;

        let pdiv = doc.createElement("DIV");
        pdiv.className = BEZEL_WRAPPER_CLASSNAME;
        pdiv.style = `position:absolute;width:100%;top:0;margin-top:15%;z-index:100;text-align:center;display:none`;

        let tdiv = doc.createElement("DIV");
        tdiv.className = BEZEL_CLASSNAME;
        tdiv.style = `display:inline-block;background:rgba(0,0,0,0.5);color:#fff;padding:10px 20px;border-radius:3px;font-size:175%`;
        pdiv.appendChild(tdiv);

        let text = doc.createTextNode("1.0x");
        tdiv.appendChild(text);
        doc.querySelector(PANGZI_VIDEO_PLAYER_WRAPPER_SELECTOR).appendChild(pdiv);

        doc.querySelector(PANGZI_SPEED_ADJUST_MENU_SELECTOR).innerHTML = "";

        let items = [2, 1.75, 1.5, 1.25, 1, 0.75];
        for (let rate of items) {
            let li = doc.createElement("LI");
            li.className = "vjs-menu-item";
            li.tabIndex = -1;
            li.role = "menuitemcheckbox";
            li.ariaLive = "polite";
            li.ariaDisabled = false;
            li.ariaChecked = false;
            li.innerHTML = `${rate}x <span class="vjs-control-text"> </span>`;

            if (rate === 1) li.classList.add("vjs-selected");

            doc.querySelector(PANGZI_SPEED_ADJUST_MENU_SELECTOR).appendChild(li);

            li.addEventListener("click", ev => {
                doc.querySelector(PANGZI_SPEED_ADJUST_SELECTOR).classList.remove("vjs-selected");
                doc.querySelector(PANGZI_VIDEO_PLAYER_SELECTOR).playbackRate = rate;
                li.classList.add("vjs-selected");
            });
        }

        // disable adjusting speed on click
        doc.querySelector(PANGZI_CURRENT_SPEED_SELECTOR).addEventListener("click", ev => ev.stopPropagation());

        console.debug("video-hotkeys loaded for PangziTV");
    }, 300);
}

let loader = setInterval(function () {
    if (top.document.readyState !== "complete") return;
    clearInterval(loader);
    if (top.document.querySelector(BILI_IS_VIDEO_PLAYER_TEST_SELECTOR)) {
        console.debug("video-hotkeys detected Bilibili player");
        site = "bili";
        init_bili();
    }
    else if (top.document.querySelector(PANGZI_IS_VIDEO_PLAYER_TEST_SELECTOR)) {
        console.debug("video-hotkeys detected PangziTV player");
        site = "pangzi";
        init_pangzi();
    }
    else {
        console.debug("video-hotkeys detected no video player");
    }
}, 300);
