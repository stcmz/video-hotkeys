export class Log {
    private static format(msg: string): string {
        return `[video-hotkeys][${new Date().toLocaleString()}] ${msg}`;
    }

    static log(msg: string) {
        console.log(Log.format(msg));
    }

    static debug(msg: string) {
        console.debug(Log.format(msg));
    }

    static warn(msg: string) {
        console.warn(Log.format(msg));
    }

    static error(msg: string) {
        console.error(Log.format(msg));
    }
}