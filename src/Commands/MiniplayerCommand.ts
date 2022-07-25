import { PlayerContext } from "../Core/PlayerContext";
import { Command, CommandName } from "../Core/Command";
import { Message } from "../Core/Message";

export class MiniplayerCommand implements Command {
    name: CommandName = "miniplayer";
    context?: PlayerContext;

    async call(): Promise<Message> {
        if (!this.context)
            throw new Error("no context");

        if (this.context.getMiniplayerButton) {
            let button = this.context.getMiniplayerButton();

            if (button && button.click) {
                button.click();
                return { succeeded: true };
            }
        }

        return { succeeded: false };
    }
}