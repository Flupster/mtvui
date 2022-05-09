import videojs from "video.js";

const Button = videojs.getComponent("Button");
const ViewerButton = videojs.extend(Button, {
  constructor: function (player) {
    Button.apply(this, arguments);

    // Set viewers count from socket message
    player.socket.on("streamInfo", (info) => {
      this.updateViewers(info.meta.viewers);
    });

    // on clicking the icon seek to the live edge - 5s
    this.on("click", () => {
      if (player.liveTracker.liveCurrentTime() !== Infinity) {
        player.currentTime(player.liveTracker.liveCurrentTime() - 5);
      }
    });
  },

  createEl: function () {
    return videojs.dom.createEl("button", {
      className: "vjs-viewers-control vjs-control vjs-button",
    });
  },

  updateViewers: function (viewers) {
    this.el().innerHTML = `<i class="far fa-eye"></i> &nbsp; ${viewers}`;
  },
});

videojs.registerComponent("ViewerButton", ViewerButton);
