import { BilibiliPlayerContext } from "../Contexts/BilibiliPlayerContext";
import { QiyiPlayerContext } from "../Contexts/QiyiPlayerContext";
import { PangziTvPlayerContext } from "../Contexts/PangziTvPlayerContext";
import { TencentPlayerContext } from "../Contexts/TencentPlayerContext";
import { YoukuPlayerContext } from "../Contexts/YoukuPlayerContext";
import { XiguaPlayerContext } from "../Contexts/XiguaPlayerContext";
import { MangoTvPlayerContext } from "../Contexts/MangoTvPlayerContext";
import { OleVodPlayerContext } from "../Contexts/OleVodPlayerContext";
import { AcFunPlayerContext } from "../Contexts/AcFunPlayerContext";
import { SohuTvPlayerContext } from "../Contexts/SohuTvPlayerContext";
import { DubokuPlayerContext } from "../Contexts/DubokuPlayerContext";
import { GenericPlayerContext } from "../Contexts/GenericPlayerContext";
import { YouTubePlayerContext } from "../Contexts/YouTubePlayerContext";
import { HaokanPlayerContext } from "../Contexts/HaokanPlayerContext";
import { SportsNetPlayerContext } from "../Contexts/SportsNetPlayerContext";
import { Settings } from "../Settings";
import { PlayerContext } from "./PlayerContext";

export class PlayerContextManager {
    static matchByHostname(hostname: string): PlayerContext | null {
        // Initialize all known player contexts
        let contexts: PlayerContext[] = [
            new BilibiliPlayerContext(),
            new PangziTvPlayerContext(),
            new QiyiPlayerContext(),
            new TencentPlayerContext(),
            new YoukuPlayerContext(),
            new XiguaPlayerContext(),
            new MangoTvPlayerContext(),
            new OleVodPlayerContext(),
            new AcFunPlayerContext(),
            new SohuTvPlayerContext(),
            new DubokuPlayerContext(),
            new YouTubePlayerContext(),
            new HaokanPlayerContext(),
            new SportsNetPlayerContext(),
        ];

        // Match a known player context
        for (let context of contexts) {
            const match = context.hosts.find(o => o.match == hostname);
            if (!match)
                continue;
            // Found a canonical URL, redirect
            if (!match.canonical)
                return context;
            window.setTimeout(() => location.hostname = match.canonical!, 0);
            return null;
        }

        // Try to find an immediate video element in the top window
        // In this stage, the document may still be loading.
        // TODO: If we cannot find one for now, we will retry once the document loaded.
        if (Settings.useGenericContext) {
            if (document.querySelector("video"))
                return new GenericPlayerContext();
        }

        return null;
    }
}