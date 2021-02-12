document.onkeypress = ev => {
    if (document.activeElement.tagName === "INPUT"
        || document.activeElement.tagName === "TEXTAREA"
        || document.activeElement.tagName === "SELECT"
        || ev.altKey
        || ev.ctrlKey)
        return;
    if (ev.key === 'd' || ev.key === 'D')
        document.querySelector(".bui-switch-input").click();
    if (ev.key === 'f' || ev.key === 'F')
        document.querySelector(".bilibili-player-iconfont-fullscreen-off").click();
    else if (ev.key === ' ')
        document.querySelector(".bilibili-player-video-btn-start").click();
    else if (ev.key === '<')
        document.querySelector(".bilibili-player-video-btn-speed-menu-list.bilibili-player-active").nextSibling.click();
    else if (ev.key === '>')
        document.querySelector(".bilibili-player-video-btn-speed-menu-list.bilibili-player-active").previousSibling.click();
    else
        return true;
    return false;
}
