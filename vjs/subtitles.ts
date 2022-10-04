import videojs, { VideoJsPlayer } from "video.js";
import { useToast } from "vue-toastification";

const Plugin = videojs.getPlugin("plugin");

class SubtitlePlugin extends Plugin {
  player: VideoJsPlayer;
  toast: any;
  offset: number;

  constructor(player: VideoJsPlayer) {
    super(player);
    this.toast = useToast();

    // Manual Offset
    this.offset = 0;
    player.on("keyup", (e) => {
      switch (e.key) {
        case "ArrowLeft":
          this.manualOffset(-0.2);
          break;
        case "ArrowRight":
          this.manualOffset(0.2);
          break;
        default:
          break;
      }
    });

    player.one("missingTime", () => this.getSubtitles());
  }

  async getSubtitles() {
    const req = await fetch("https://minusten.tv/subtitles/list");
    const json = (await req.json()) as string[];
    
    await Promise.all(json.map((s) => this.addSubtitles(s)));

    const missingTime = this.player.missingTime / 1000;
    this.offsetSubtitles(-missingTime + 3);
  }

  addSubtitles(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const track = this.player.addRemoteTextTrack(
        {
          src: `/subtitles/${src}`,
          srclang: src.split(".vtt")[0],
        },
        false
      );

      track.addEventListener("load", () => resolve());
      track.addEventListener("abort", () => reject());
    });
  }

  manualOffset(seconds: number) {
    this.offset += seconds;
    this.offsetSubtitles(seconds);
    this.toast.clear();
    this.toast.success("Subtitle Offset: " + this.offset.toFixed(1));
  }

  offsetSubtitles(seconds: number) {
    const tracks = this.player.textTracks();
    Array.from(tracks).forEach((t) => {
      Array.from(t.cues).forEach((cue) => {
        cue.startTime += seconds;
        cue.endTime += seconds;
      });
    });
  }
}

videojs.registerPlugin("subtitles", SubtitlePlugin);
