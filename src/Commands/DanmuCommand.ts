import { PlayerContext } from "../Core/PlayerContext";
import { CommandName, ToggleCommand } from "../Core/Command";
import { Message } from "../Core/Message";
import { Overlay } from "../Core/Overlay";
import { Log } from "../Utils/Log";

export class DanmuCommand implements ToggleCommand {
    name: CommandName = "danmu";
    context?: PlayerContext;

    async call(): Promise<Message> {
        if (!this.context)
            throw new Error("no context");

        let status = await this.status();
        if (status == null)
            return DanmuCommand.format();

        let danmuButton = this.context.getDanmuButton!()!;

        if (this.context.toggleDanmu)
            this.context.toggleDanmu(danmuButton);
        else
            danmuButton.click();

        if (this.context.onDanmuChanged)
            this.context.onDanmuChanged(!status);

        return DanmuCommand.format(!status);
    }

    async status(): Promise<boolean | null> {
        if (!this.context)
            throw new Error("no context");

        if (!this.context.getDanmuButton)
            return null;

        let danmuButton = this.context.getDanmuButton();
        if (!danmuButton)
            return null;

        if (this.context.getDanmuStatus)
            return this.context.getDanmuStatus(danmuButton);

        if (danmuButton as HTMLInputElement)
            return (danmuButton as HTMLInputElement).checked;

        return null;
    }

    async set(on: boolean): Promise<boolean> {
        if (!this.context)
            throw new Error("no context");

        let status = await this.status();
        if (status == null) {
            console.warn(Log.format("cannot get danmu status"));
            return false;
        }

        if (status != on) {
            let danmuButton = this.context.getDanmuButton!()!;

            if (this.context.toggleDanmu)
                this.context.toggleDanmu(danmuButton);
            else
                danmuButton.click();
        }

        status = await this.status();
        if (status != on) {
            console.warn(Log.format("cannot set danmu status"));
            return false;
        }

        if (this.context.onDanmuChanged)
            this.context.onDanmuChanged(on);

        return true;
    }

    static format(on?: boolean | null): Message {
        if (on === undefined)
            return { succeeded: false, content: chrome.i18n.getMessage("no_danmu") };
        return { succeeded: true, content: on ? Overlay.danmuOnText : Overlay.danmuOffText };
    }
}