import { PlayerContext } from "../Core/PlayerContext";
import { CommandName, ToggleCommand } from "../Core/Command";
import { Message } from "../Core/Message";

export class PlayCommand implements ToggleCommand {
    name: CommandName = "play";
    context?: PlayerContext;

    async call(): Promise<Message> {
        if (!this.context)
            throw new Error("no context");

        let result = await this.context.video.play();
        if (result == null)
            return { succeeded: false };

        return { succeeded: true };
    }

    async status(): Promise<boolean | null> {
        if (!this.context)
            throw new Error("no context");

        return await this.context.video.playStatus();
    }

    async set(playing: boolean): Promise<boolean> {
        if (!this.context)
            throw new Error("no context");

        let oldStatus = await this.context.video.playStatus();
        if (oldStatus == null)
            return false;

        if (oldStatus != playing)
            return await this.context.video.play() ?? false;
        return true;
    }
}