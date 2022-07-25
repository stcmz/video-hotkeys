import { PlayerContext } from "../Core/PlayerContext";
import { CommandName, ToggleCommand } from "../Core/Command";
import { Message } from "../Core/Message";
import { Overlay } from "../Core/Overlay";

export class MuteCommand implements ToggleCommand {
    name: CommandName = "mute";
    context?: PlayerContext;

    async call(): Promise<Message> {
        if (!this.context)
            throw new Error("no context");

        let muted = await this.context.video.mute();
        return MuteCommand.format(muted);
    }

    async status(): Promise<boolean | null> {
        if (!this.context)
            throw new Error("no context");

        return await this.context.video.muteStatus();
    }

    async set(muted: boolean): Promise<boolean> {
        if (!this.context)
            throw new Error("no context");

        let oldStatus = await this.context.video.muteStatus();
        if (oldStatus == null)
            return false;

        if (oldStatus != muted)
            await this.context.video.mute();
        return true;
    }

    static format(muted?: boolean | null): Message {
        if (muted == null)
            return { succeeded: false, content: "error mute status" };
        return { succeeded: true, content: muted ? Overlay.volumeOffIcon : Overlay.volumeUpIcon };
    }
}