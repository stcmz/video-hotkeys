const SPEED_ADJUST_SELECTOR = ".bilibili-player-video-btn-speed-menu-list.bilibili-player-active";
const PLAY_CONTROL_SELECTOR = ".bilibili-player-video-btn-start button";
const FULLSCREEN_CONTROL_SELECTOR = ".bilibili-player-iconfont-fullscreen-off";
const DANMU_SWITCH_SELECTOR = ".bilibili-player-video-danmaku-switch .bui-switch-input";
const VIDEO_PLAYER_SELECTOR = ".bilibili-player-video video";
const VIDEO_PLAYER_WRAPPER_SELECTOR = ".bilibili-player-video-wrap";
const VIDEO_PLAYER_READY_TEST_SELECTOR = ".bilibili-player-video-panel-text .bilibili-player-video-panel-row";
const BEZEL_CLASSNAME = "bilibili-hotkeys-bezel";
const BEZEL_WRAPPER_CLASSNAME = "bilibili-hotkeys-bezel-wrapper";
const DANMU_ON_TEXT = "弹幕开启";
const DANMU_OFF_TEXT = "弹幕关闭";

// test videos:
// https://www.bilibili.com/festival/2021bnj
// https://www.bilibili.com/video/BV1Po4y1d7kv
// https://www.bilibili.com/bangumi/play/ss20927

function showhint(text) {
    document.querySelector(`.${BEZEL_CLASSNAME}`).textContent = text;
    document.querySelector(`.${BEZEL_WRAPPER_CLASSNAME}`).style.display = "";
    setTimeout(function () {
        document.querySelector(`.${BEZEL_WRAPPER_CLASSNAME}`).style.display = "none";
    }, 500);
}

document.onkeypress = ev => {
    if (document.activeElement.tagName === "INPUT"
        || document.activeElement.tagName === "TEXTAREA"
        || document.activeElement.tagName === "SELECT"
        || ev.altKey
        || ev.ctrlKey)
        return;
    if (ev.key === 'd' || ev.key === 'D') {
        document.querySelector(DANMU_SWITCH_SELECTOR).click();
        showhint(document.querySelector(DANMU_SWITCH_SELECTOR).checked ? DANMU_ON_TEXT : DANMU_OFF_TEXT);
    }
    if (ev.key === 'f' || ev.key === 'F') {
        document.querySelector(FULLSCREEN_CONTROL_SELECTOR).click();
    }
    else if (ev.key === ' ') {
        document.querySelector(PLAY_CONTROL_SELECTOR).click();
    }
    else if (ev.key === '<') {
        let next = document.querySelector(SPEED_ADJUST_SELECTOR).nextSibling;
        if (next.click)
            next.click();
        showhint(document.querySelector(SPEED_ADJUST_SELECTOR).textContent);
    }
    else if (ev.key === '>') {
        let prev = document.querySelector(SPEED_ADJUST_SELECTOR).previousSibling;
        if (prev.click)
            prev.click();
        showhint(document.querySelector(SPEED_ADJUST_SELECTOR).textContent);
    }
    else if ('0' <= ev.key && ev.key <= '9') {
        let video = document.querySelector(VIDEO_PLAYER_SELECTOR);
        video.currentTime = (ev.key.charCodeAt(0) - "0".charCodeAt(0)) * video.duration / 10;
    }
    else {
        return true;
    }
    return false;
}

let loader = setInterval(function () {
    if (document.readyState !== "complete"
        || !document.querySelector(VIDEO_PLAYER_SELECTOR)
        || document.querySelector(VIDEO_PLAYER_SELECTOR).readyState === 0
        || !document.querySelector(PLAY_CONTROL_SELECTOR)
        || ![...document.querySelectorAll(VIDEO_PLAYER_READY_TEST_SELECTOR)].every(o => o.textContent.substr(-4) === "[完成]")) {
        return;
    }
    clearInterval(loader);

    let pdiv = document.createElement("DIV");
    pdiv.className = BEZEL_WRAPPER_CLASSNAME;
    pdiv.style = `position:absolute;width:100%;margin-top:15%;z-index:100;text-align:center;display:none`;

    let tdiv = document.createElement("DIV");
    tdiv.className = BEZEL_CLASSNAME;
    tdiv.style = `display:inline-block;background:rgba(0,0,0,0.5);color:#fff;padding:10px 20px;border-radius:3px;font-size:175%`;
    pdiv.appendChild(tdiv);

    let text = document.createTextNode("1.5x");
    tdiv.appendChild(text);
    document.querySelector(VIDEO_PLAYER_WRAPPER_SELECTOR).appendChild(pdiv);

    let video = document.querySelector(VIDEO_PLAYER_SELECTOR);
    if (video.paused)
        video.click();

    console.log("bilibili-hotkeys extension loaded");
}, 300);
