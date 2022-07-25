import { Log } from "../Utils/Log";
import { Video } from "./Video";

export class NativeVideo extends Video {
    hasInited(_: Document): boolean {
        return true;
    }

    init(_: Document): void {
    }

    async readyState(): Promise<number | null> {
        let video = this.element;
        if (!video)
            return null;
        return video.readyState;
    }

    async play(): Promise<boolean | null> {
        let video = this.element;
        if (!video)
            return null;

        if (video.paused) {
            await video.play().catch(() => {
                console.warn(Log.format("failed to play video"));
            });
        }
        else {
            video.pause();
        }

        return !video?.paused;
    }

    async speed(delta: number): Promise<number | null> {
        let video = this.element;
        if (!video)
            return null;
        video.playbackRate += delta;
        return video.playbackRate;
    }

    async mute(): Promise<boolean | null> {
        let video = this.element;
        if (!video)
            return null;
        video.muted = !video.muted;
        return video.muted;
    }

    async volume(delta: number): Promise<number | null> {
        let video = this.element;
        if (!video)
            return null;
        video.volume = Math.max(0, Math.min(1, video.volume + delta));
        return video.volume;
    }

    async skip(delta: number): Promise<number | null> {
        let video = this.element;
        if (!video)
            return null;
        let newTime = video.currentTime + video.playbackRate * delta;
        if (newTime != video.currentTime)
            video.currentTime = Math.max(0, Math.min(video.duration, newTime));
        return video.currentTime;
    }

    async seek(pos: number): Promise<number | null> {
        let video = this.element;
        if (!video)
            return null;
        video.currentTime = pos * video.duration;
        return video.currentTime / video.duration;
    }

    async playStatus(): Promise<boolean | null> {
        let video = this.element;
        if (!video)
            return null;
        return !video.paused;
    }

    async speedStatus(): Promise<number | null> {
        let video = this.element;
        if (!video)
            return null;
        return video.playbackRate;
    }

    async muteStatus(): Promise<boolean | null> {
        let video = this.element;
        if (!video)
            return null;
        return video.muted;
    }

    async volumeStatus(): Promise<number | null> {
        let video = this.element;
        if (!video)
            return null;
        return video.volume;
    }

    async skipStatus(): Promise<number | null> {
        let video = this.element;
        if (!video)
            return null;
        return video.currentTime;
    }

    async seekStatus(): Promise<number | null> {
        let video = this.element;
        if (!video)
            return null;
        return video.currentTime / video.duration;
    }
}