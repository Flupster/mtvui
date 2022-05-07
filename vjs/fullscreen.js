import videojs from "video.js";

const Plugin = videojs.getPlugin("plugin");

class FullscreenPlugin extends Plugin {
  constructor(player) {
    super(player);

    player.on("dblclick", (e) => {
      if (e.target.nodeName === "DIV") {
        player.isFullscreen()
          ? player.exitFullscreen()
          : player.requestFullscreen();
      }
    });
  }
}

videojs.registerPlugin("fullscreen", FullscreenPlugin);
