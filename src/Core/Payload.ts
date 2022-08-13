import { VideoCommandName } from "./Command";
import { Selector } from "./Selector";

export interface Payload {
    to: "webpage" | "contentscript";
    type: "get" | "set" | "ping";
    selectors: Selector[];
    command: VideoCommandName;
    arg: number;
    result: boolean | number | null;
}