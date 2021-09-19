import { Log } from "../Log";
import { Payload } from "./Payload";

Log.context = "webpage";

function notify(data: Payload, value: boolean | number | null) {
    data.to = "VideoHotkeys";
    if (value === null)
        data.success = false;
    else {
        data.value = value;
        data.success = true;
    }
    window.postMessage(data, "*");
}

window.addEventListener("message", ev => {
    // We only accept messages from ourselves
    if (ev.source != window)
        return;

    let data = <Payload>ev.data;
    if (data.to != "WebPage")
        return;

    let video = document.querySelector<HTMLVideoElement>(data.video);

    if (!video) {
        notify(data, null);
        return;
    }

    if (data.type === "set") {
        switch (data.command) {
            case "play":
                video.paused ? video.play() : video.pause();
                notify(data, !video.paused);
                break;
            case "speed":
                video.playbackRate += ev.data.delta;
                notify(data, video.playbackRate);
                break;
            case "mute":
                video.muted = !video.muted;
                notify(data, video.muted);
                break;
            case "volume":
                video.volume = Math.max(0, Math.min(1, video.volume + data.delta));
                notify(data, video.volume);
                break;
            case "skip":
                let newTime = video.currentTime + video.playbackRate * data.delta;
                if (newTime != video.currentTime)
                    video.currentTime = Math.max(0, Math.min(video.duration, newTime));
                notify(data, video.currentTime);
                break;
            case "seek":
                video.currentTime = data.delta * video.duration;
                notify(data, video.currentTime / video.duration);
                break;
        }
    }
    else {
        switch (data.command) {
            case "play":
                notify(data, !video.paused);
                break;
            case "speed":
                notify(data, video.playbackRate);
                break;
            case "mute":
                notify(data, video.muted);
                break;
            case "volume":
                notify(data, video.volume);
                break;
            case "skip":
                notify(data, video.currentTime);
                break;
            case "seek":
                notify(data, video.currentTime);
                break;
        }
    }
}, false);
