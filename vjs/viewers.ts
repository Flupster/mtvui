// @ts-nocheck (createEl is not assignable bug)
import videojs, { VideoJsPlayer } from "video.js";

const Button = videojs.getComponent("Button");

class ViewerButton extends Button {
  constructor(player: VideoJsPlayer) {
    super(player);

    // Set viewers count from socket message
    window.$socket.on("streamInfo", (info) => {
      this.updateViewers(info.meta.viewers);
    });

    // on clicking the icon seek to the live edge - 5s
    this.on("click", () => {
      if (player.liveTracker.liveCurrentTime() !== Infinity) {
        player.currentTime(player.liveTracker.liveCurrentTime() - 5);
      }
    });
  }

  createEl(): Element {
    return videojs.dom.createEl("button", {
      className: "vjs-viewers-control vjs-control vjs-button",
    });
  }

  updateViewers(viewers) {
    this.el().innerHTML = `<i class="far fa-eye"></i> &nbsp; ${viewers}`;
  }
}

videojs.registerComponent("ViewerButton", ViewerButton);
