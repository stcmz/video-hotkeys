import { HotKeyManager } from "./HotKeyManager";
import { Log } from "./Logger";
import { VideoWebsiteProviders } from "./Registry/VideoWebsiteProviders";
import { VideoWebsiteUrls } from "./Registry/VideoWebsites";


function main() {
    for (let item of Object.values(VideoWebsiteUrls)) {
        // redirect obsolete to domain
        if (item.obsoleteUrl && location.href.startsWith(item.obsoleteUrl)) {
            location.replace(item.url + location.href.slice(item.obsoleteUrl.length));
            return;
        }
    }

    let loader = window.setInterval(() => {
        // wait until top document is ready
        if (top.document.readyState !== "complete")
            return;
        clearInterval(loader);

        // match a video provider
        let found = false;
        for (let name in VideoWebsiteProviders) {
            let provider = VideoWebsiteProviders[name].provider;
            if (provider.isPlayer) {
                Log.debug(`detected ${name} player`);
                HotKeyManager.setVideoProvider(provider);
                found = true;
                break;
            }
        }

        // nothing to do, exiting
        if (!found) {
            Log.debug("no video player detected");
        }
    }, 300);
}

main();

