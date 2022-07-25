import { Message } from "./Message";
import { PlayerContext } from "./PlayerContext";

export interface Command {
    // The context for the player
    context?: PlayerContext;

    // The name of the command
    name: CommandName;

    // Returning true indicates a message needs to display
    call(): Promise<Message>;
}

export interface ToggleCommand extends Command {
    // Gets the toggle status
    status(): Promise<boolean | null>;

    // Turns on or off the toggle
    set(status: boolean): Promise<boolean>;
}

export type CommandName = "play" | "speed" | "skip" | "seek" | "mute" | "volume" | "episode" | "fullscreen" | "theater" | "fullwebpage" | "miniplayer" | "danmu";