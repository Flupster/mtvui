import videojs from "video.js";
import { useToast } from "vue-toastification";

const Plugin = videojs.getPlugin("plugin");

class InteractPlugin extends Plugin {
  constructor(player) {
    super(player);
    this.player = player;
    this.toast = useToast();
  }

  play() {
    this.player.play(arguments).catch((e) => {
      this.player.nointeract = true;
      this.player.muted(true);
      this.player.play(arguments);
      this.toast.info(
        "Please allow the audio permission in your browser\n\n1) Padlock icon next to the URL\n2) Site Settings\n3) Sound: Allow",
        { timeout: 15000 }
      );
    });
  }
}

videojs.registerPlugin("interact", InteractPlugin);
