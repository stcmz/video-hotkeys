import { PlayerContext } from "../Core/PlayerContext";
import { Command, CommandName } from "../Core/Command";
import { Message } from "../Core/Message";
import { findElementSibling } from "../Utils/Element";
import { Settings } from "../Settings";

export class SpeedCommand implements Command {
    name: CommandName = "speed";
    context?: PlayerContext;
    up: boolean;

    constructor(up: boolean) {
        this.up = up;
    }

    async call(): Promise<Message> {
        if (!this.context)
            throw new Error("no context");

        if (this.context.getActiveSpeedMenuItem) {
            let currItem = this.context.getActiveSpeedMenuItem();
            if (!currItem)
                return { succeeded: false };

            const reverseSpeed = this.context.reverseSpeedControl ? this.context.reverseSpeedControl() : false;
            let up = reverseSpeed != this.up;
            let newItem: HTMLElement | null;

            if (this.context.isSpeedMenuItem)
                newItem = findElementSibling(currItem, !up, this.context.isSpeedMenuItem);
            else
                newItem = findElementSibling(currItem, !up, elem => elem.nodeName == currItem!.nodeName);

            if (newItem)
                newItem.click();
            else
                newItem = currItem;

            let speed: number | null | undefined = null;

            if (this.context.getSpeed) {
                speed = this.context.getSpeed(newItem);
            }
            else if (newItem.textContent) {
                let speedTitle = newItem.textContent.trim();

                // Speed in the form of "Normal"
                if (speedTitle.toLowerCase() == "normal" || speedTitle == "正常")
                    speed = 1.0;

                // Speed in the form of "x1.0"
                else if (speedTitle.match(/^x\d(\.\d+)?/))
                    speed = parseFloat(speedTitle.substring(1));

                // Speed in the form of "1.0x" or "1.0"
                else if (speedTitle.match(/^\d(\.\d+)?/))
                    speed = parseFloat(speedTitle);

                // Error speed
                else
                    speed = null;
            }
            else {
                // Display the current speed even reached the end
                speed = await this.context.video.speedStatus()
            }

            if (speed && this.context.onSpeed)
                this.context.onSpeed(speed);

            return SpeedCommand.format(speed);
        }

        // Default process - adjust playback rate in steps

        let speed = await this.context.video.speedStatus();
        if (speed == null)
            return SpeedCommand.format();

        let newSpeed = speed;

        if (this.up) {
            for (let i of Settings.speedBrackets)
                if (i > speed) {
                    newSpeed = i;
                    break;
                }
        }
        else {
            for (let i of Settings.speedBrackets)
                if (i < speed)
                    newSpeed = i;
                else
                    break;
        }

        await this.context.video.speed(newSpeed - speed);

        // Notify event handler
        if (this.context.onSpeed)
            this.context.onSpeed(newSpeed);

        return SpeedCommand.format(newSpeed);
    }

    static format(speed?: number | null): Message {
        if (speed == null)
            return { succeeded: false, content: "error speed" };
        return { succeeded: true, content: `${speed}x` };
    }
}