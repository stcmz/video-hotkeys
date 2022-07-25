export class Log {
    static context: "webpage" | "contentscript" | "backgroundscript";

    static format(msg: string) {
        return `[vh-${Log.context}][${new Date().toISOString()}] ${msg}`;
    }
}