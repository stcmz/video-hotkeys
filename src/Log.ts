export class Log {
    static context: "webpage" | "contentscript" | "backgroundscript";

    static format(msg: string) {
        if (Log.context === "webpage")
            return `[video-hotkeys-web][${new Date().toLocaleString()}] ${msg}`;
        return `[video-hotkeys][${new Date().toLocaleString()}] ${msg}`;
    }
}