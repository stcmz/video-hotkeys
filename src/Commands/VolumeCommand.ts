import { PlayerContext } from "../Core/PlayerContext";
import { Command, CommandName } from "../Core/Command";
import { Message } from "../Core/Message";
import { Settings } from "../Settings";

export class VolumeCommand implements Command {
    name: CommandName = "volume";
    context?: PlayerContext;
    delta: number;

    constructor(delta: number) {
        this.delta = delta;
    }

    async call(): Promise<Message> {
        if (!this.context)
            throw new Error("no context");

        let muted = await this.context.video.muteStatus();
        if (muted == null)
            return VolumeCommand.format();

        // Unmute if allowed
        if (muted && Settings.unmuteOnVolumeChange)
            await this.context.video.mute();

        // Adjust volume
        let volume = await this.context.video.volume(this.delta);

        if (volume == null)
            return VolumeCommand.format();

        // Notify event handler
        if (this.context.onVolume)
            this.context.onVolume(volume);

        return VolumeCommand.format(volume);
    }

    static format(volume?: number | null): Message {
        if (volume == null)
            return { succeeded: false, content: "error volume" };
        return { succeeded: true, content: `${Math.round(volume * 100)}%` };
    }
}