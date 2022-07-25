import { PlayerContext } from "../Core/PlayerContext";
import { Command, CommandName } from "../Core/Command";
import { Message } from "../Core/Message";

export class SeekCommand implements Command {
    name: CommandName = "seek";
    context?: PlayerContext;
    pos: number;

    constructor(pos: number) {
        this.pos = pos;
    }

    async call(): Promise<Message> {
        if (!this.context)
            throw new Error("no context");

        let result = await this.context.video.seek(this.pos);
        if (result == null)
            return { succeeded: false };

        return { succeeded: true };
    }
}