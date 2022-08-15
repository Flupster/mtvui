import videojs, { VideoJsPlayer } from "video.js";
import { useToast } from "vue-toastification";

declare module "video.js" {
  interface VideoJsPlayer {
    nointeract: boolean;
    interact(): InteractPlugin;
  }
}

const Plugin = videojs.getPlugin("plugin");

class InteractPlugin extends Plugin {
  toast: any;
  constructor(player: VideoJsPlayer) {
    super(player);
    this.player = player;
    this.toast = useToast();
  }

  play(...args: any[]) {
    this.player.play(args).catch((e) => {
      if (e.name === "NotAllowedError") {
        this.player.nointeract = true;
        this.player.muted(true);
        this.player.play(args);
        this.toast.info(
          "Please allow the audio permission in your browser\n\n1) Padlock icon next to the URL\n2) Site Settings\n3) Sound: Allow",
          { timeout: 15000 }
        );
      } else {
        this.player.log("play error", e);
      }
    });
  }
}

videojs.registerPlugin("interact", InteractPlugin);
