import { PlayerContext } from "../Core/PlayerContext";
import { Command, CommandName } from "../Core/Command";
import { Message } from "../Core/Message";

export class SkipCommand implements Command {
    name: CommandName = "skip";
    context?: PlayerContext;
    delta: number;

    constructor(delta: number) {
        this.delta = delta;
    }

    async call(): Promise<Message> {
        if (!this.context)
            throw new Error("no context");

        let result = await this.context.video.skip(this.delta);
        if (result == null)
            return { succeeded: false };

        return { succeeded: true };
    }
}