import { PlayerContext } from "../Core/PlayerContext";
import { Command, CommandName } from "../Core/Command";
import { Message } from "../Core/Message";
import { findElementSibling, findElementSiblingSameType } from "../Utils/Element";

export class EpisodeCommand implements Command {
    name: CommandName = "episode";
    context?: PlayerContext;
    next: boolean;

    constructor(next: boolean) {
        this.next = next;
    }

    async call(): Promise<Message> {
        if (!this.context)
            throw new Error("no context");

        // Episode menu not supported, no user hint
        if (!this.context.getActiveEpisodeMenuItem)
            return { succeeded: false };

        // Episode menu not found
        let currItem = this.context.getActiveEpisodeMenuItem();
        if (!currItem)
            return { succeeded: false, content: chrome.i18n.getMessage("no_playlist") };

        let next = (this.context.reverseEpisodeControl == true) != this.next;
        let newItem: HTMLElement | null;

        if (this.context.isEpisodeMenuItem)
            newItem = findElementSibling(currItem, next, this.context.isEpisodeMenuItem);
        else
            newItem = findElementSiblingSameType(currItem, next);

        // Try to open the episode if new
        if (!newItem) {
            newItem = currItem;
        }
        else if (this.context.openEpisode) {
            this.context.openEpisode(newItem);
        }
        else {
            let anchor = newItem.querySelector("a");
            if (anchor) {
                anchor.click();
            }
            else {
                if (newItem.click) {
                    newItem.click();
                }
            }
        }

        // Try to get the episode title
        let title: string | null = null;
        if (this.context.getEpisodeTitle) {
            title = this.context.getEpisodeTitle(newItem);
        }

        if (title == null) {
            title = newItem.textContent?.trim() ?? null;
        }

        return EpisodeCommand.format(title?.trim());
    }

    static format(title?: string | null): Message {
        if (title === undefined || title === null)
            return { succeeded: false, content: chrome.i18n.getMessage("no_episode_title"), duration: 2000 };

        if (title.match(/^\d+$/g)) {
            let templ = chrome.i18n.getMessage("episode_title_templ");
            title = templ.replace("{0}", title);
        }

        return { succeeded: true, content: title, duration: 2000 };
    }
}