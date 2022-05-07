import videojs from "video.js";

const Plugin = videojs.getPlugin("plugin");

class VolumePlugin extends Plugin {
  constructor(player) {
    super(player);
    this.player = player;
    this.volume = localStorage.getItem("volume") ?? 1;
    
    this.player.on("volumechange", this.onVolumeChange.bind(this));
    this.player.on("play", () => this.player.volume(this.volume));

    // clicking the video unmutes if we havent interacted with the dom
    this.player.on("click", () => {
      if (this.player.nointeract) {
        this.player.nointeract = false;
        this.player.muted(false);
        this.player.volume(this.volume);
      }
    });

    // Keybinds for scroll wheel to change volume
    player.on("wheel", (e) => {
      if (player.muted() && !player.nointeract) player.muted(false);
      player.volume(player.volume() - e.deltaY / 3000);
    });
  }

  onVolumeChange() {
    if (this.player.muted()) return;

    this.volume = this.player.volume();
    localStorage.setItem("volume", this.volume);
  }
}

videojs.registerPlugin("volumesync", VolumePlugin);
