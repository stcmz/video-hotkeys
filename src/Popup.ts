import { VideoWebsiteProviders } from "./Registry/VideoWebsiteProviders";
import open_in_new from "./Assets/open_in_new_black_18dp.svg";
import { VideoWebsiteKeys, VideoWebsiteUrls } from "./Registry/VideoWebsites";

function main() {
    let ul = document.querySelector<HTMLUListElement>(".sitemenu")!;

    for (let [key, item] of Object.entries(VideoWebsiteProviders)) {
        for (let website in item.websites) {
            let li = document.createElement("li");
            ul.appendChild(li);

            let a = document.createElement("a");
            a.href = VideoWebsiteUrls[website as VideoWebsiteKeys].url;
            a.target = "_blank";

            a.innerHTML = open_in_new;

            let name = chrome.i18n.getMessage(key);
            let span = document.createTextNode(name);
            a.appendChild(span);

            li.appendChild(a);
        }
    }

    let elems = document.querySelectorAll("[i18n]");
    elems.forEach(el => {
        let i18n = el.getAttribute("i18n")!;
        let msg = chrome.i18n.getMessage(i18n);
        el.textContent = msg;
    });
}

main();