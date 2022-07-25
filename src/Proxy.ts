import { Log } from "./Utils/Log";
import { Payload } from "./Core/Payload";
import { NativeVideo } from "./Core/NativeVideo";
import { Settings } from "./Settings";

Log.context = "webpage";

window.addEventListener("message", async ev => {
    // We only accept messages from the current iframe or the root window
    if (ev.source != window && (top == null || ev.source != top))
        return;

    let data = <Payload>ev.data;
    if (data.to != "webpage")
        return;

    data.to = "contentscript";

    if (Settings.verboseLog)
        console.debug(Log.format(`received ${data.type}-${data.command} command`));

    let video = new NativeVideo(data.selectors);

    switch (data.type) {
        case "ping": data.result = await video.readyState();
            break;
        case "set":
            switch (data.command) {
                case "play":
                    data.result = await video.play();
                    break;
                case "speed":
                    data.result = await video.speed(data.arg);
                    break;
                case "mute":
                    data.result = await video.mute();
                    break;
                case "volume":
                    data.result = await video.volume(data.arg);
                    break;
                case "skip":
                    data.result = await video.skip(data.arg);
                    break;
                case "seek":
                    data.result = await video.seek(data.arg);
                    break;
            }
            break;
        case "get":
            switch (data.command) {
                case "play":
                    data.result = await video.playStatus();
                    break;
                case "speed":
                    data.result = await video.speedStatus();
                    break;
                case "mute":
                    data.result = await video.muteStatus();
                    break;
                case "volume":
                    data.result = await video.volumeStatus();
                    break;
                case "skip":
                    data.result = await video.skipStatus();
                    break;
                case "seek":
                    data.result = await video.seekStatus();
                    break;
            }
    }

    // Respond to the sender
    if (Settings.verboseLog)
        console.debug(Log.format(`responding result: ${data.result}`));
    ev.source.postMessage(data, "*");
}, false);
