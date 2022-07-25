import { PlayerContext } from "../Core/PlayerContext";
import { Command, CommandName } from "../Core/Command";
import { Message } from "../Core/Message";

export class TheaterCommand implements Command {
    name: CommandName = "theater";
    context?: PlayerContext;

    async call(): Promise<Message> {
        if (!this.context)
            throw new Error("no context");

        if (this.context.getTheaterButton) {
            let button = this.context.getTheaterButton();

            if (button && button.click) {
                button.click();
                return { succeeded: true };
            }
        }

        return { succeeded: false };
    }
}