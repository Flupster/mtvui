import videojs from "video.js";

const Plugin = videojs.getPlugin("plugin");

class VolumePlugin extends Plugin {
  constructor(player) {
    super(player);
    this.player = player;
    this.volume = player.settings.volume

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
      player.volume(player.volume() - e.deltaY / (e.altKey ? 6000 : 3000));
    });

    // Keybinds for arrow keys to change volume
    player.on("keyup", (e) => {
      switch (e.key) {
        case "m":
          player.muted(!player.muted());
          break;
        case "ArrowUp":
          player.volume(player.volume() + (e.altKey ? 0.02 : 0.04));
          break;
        case "ArrowDown":
          player.volume(player.volume() - (e.altKey ? 0.02 : 0.04));
          break;
      }
    });
  }

  onVolumeChange() {
    if (this.player.muted()) return;

    this.volume = this.player.volume();
    this.player.settings.volume = this.volume;
  }
}

videojs.registerPlugin("volumesync", VolumePlugin);
