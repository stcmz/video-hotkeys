import { PlayerContext } from "../Core/PlayerContext";
import { Command, CommandName } from "../Core/Command";
import { Message } from "../Core/Message";

export class FullwebpageCommand implements Command {
    name: CommandName = "fullwebpage";
    context?: PlayerContext;

    async call(): Promise<Message> {
        if (!this.context)
            throw new Error("no context");

        if (this.context.getFullwebpageButton) {
            let button = this.context.getFullwebpageButton();

            if (button && button.click) {
                button.click();
                return { succeeded: true };
            }
        }

        return { succeeded: false };
    }
}