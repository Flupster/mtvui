import videojs from "video.js";

const Button = videojs.getComponent("Button");
const ViewerButton = videojs.extend(Button, {
  constructor: function (player) {
    Button.apply(this, arguments);

    // Set viewers count from socket message
    player.socket.on("streamInfo", (info) => {
      this.updateViewers(info.meta.viewers);
    });

    this.on("click", () => {
      const currentTime = player.currentTime();
      const liveTime = player.liveTracker.liveCurrentTime();
      const behind = liveTime - currentTime;
      if (behind > 2 && behind !== Infinity) {
        player.currentTime(liveTime - 3);
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
