import { CommandName } from "./Command";
import { Selector } from "./Selector";

export interface Payload {
    to: "webpage" | "contentscript";
    type: "get" | "set" | "ping";
    selectors: Selector[];
    command: CommandName;
    arg: number;
    result: boolean | number | null;
}