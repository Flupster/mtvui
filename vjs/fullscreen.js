import videojs from "video.js";

const Plugin = videojs.getPlugin("plugin");

class FullscreenPlugin extends Plugin {
  constructor(player) {
    super(player);
    this.player = player;

    player.on("dblclick", (e) => {
      if (e.target.nodeName === "DIV") {
        this.toggleFullscreen();
      }
    });

    player.on("keyup", (e) => {
      if (e.altKey && e.key === "Enter") {
        this.toggleFullscreen();
      }
    });
  }

  toggleFullscreen() {
    this.player.isFullscreen()
      ? this.player.exitFullscreen()
      : this.player.requestFullscreen();
  }
}

videojs.registerPlugin("fullscreen", FullscreenPlugin);
