import { PlayerContext } from "../Core/PlayerContext";
import { Command, CommandName } from "../Core/Command";
import { Message } from "../Core/Message";

export class FullscreenCommand implements Command {
    name: CommandName = "fullscreen";
    context?: PlayerContext;

    async call(): Promise<Message> {
        if (!this.context)
            throw new Error("no context");

        if (this.context.getFullscreenButton) {
            let button = this.context.getFullscreenButton();

            if (button && button.click) {
                button.click();
                return { succeeded: true };
            }
            return { succeeded: false };
        }

        let video = this.context.video;
        if (!video.document?.fullscreenElement) {
            video.container?.requestFullscreen();
        }
        else {
            video.document.exitFullscreen();
        }
        return { succeeded: true };
    }
}