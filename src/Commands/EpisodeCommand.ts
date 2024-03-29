import { PlayerContext } from "../Core/PlayerContext";
import { Command, CommandName } from "../Core/Command";
import { Message } from "../Core/Message";
import { findElementSibling } from "../Utils/Element";

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

        const reverseEpisode = this.context.reverseEpisodeControl ? this.context.reverseEpisodeControl() : false;
        let next = reverseEpisode != this.next;
        let newItem: HTMLElement | null;

        const episodeListPaged = this.context.isEpisodeListPaged ? this.context.isEpisodeListPaged() : false;
        if (this.context.isEpisodeMenuItem)
            newItem = findElementSibling(currItem, next, this.context.isEpisodeMenuItem, episodeListPaged);
        else
            newItem = findElementSibling(currItem, next, elem => elem.nodeName == currItem!.nodeName, episodeListPaged);

        // Try to open the episode if new
        if (!newItem) {
            newItem = currItem;
        }
        else if (this.context.openEpisode) {
            this.context.openEpisode(newItem);
        }
        else {
            let clickItem: HTMLElement | null = null;
            if (this.context.getEpisodeClickItem)
                clickItem = this.context.getEpisodeClickItem(newItem);

            if (!clickItem)
                clickItem = newItem.querySelector("a");

            if (!clickItem)
                clickItem = newItem;

            clickItem.click();
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