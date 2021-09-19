export type CommandType = "play" | "speed" /*| "fullscreen" | "danmu"*/ | "mute" | "volume" | "skip" | "seek";

export interface Payload {
    to: "WebPage" | "VideoHotkeys";
    type: "get" | "set";
    video: string;
    command: CommandType;
    delta: number;
    success: boolean;
    value: boolean | number;
}