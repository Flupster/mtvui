import videojs from "video.js";

const Component = videojs.getComponent("Component");
const elapsedComponent = videojs.extend(Component, {
  constructor: function (player) {
    Component.apply(this, arguments);

    this.player = player;
    this.serverTime = 0;
    this.startTime = 0;
    this.firstPlay = 0;
    this.active = false;

    this.interval = null;

    this.el().innerHTML = "";

    player.socket.on("streamInfo", (data) => {
      if (!data.meta.isLive) return;
      this.calculateOffset(data.servertime);
      this.setStartTime(data.meta.startTime);
      this.start();
    });

    player.socket.on("streamEnd", () => this.stop());

    player.on("firstplay", () => (this.firstPlay = +new Date()));
  },

  createEl: function () {
    return videojs.dom.createEl("div", {
      className: "vjs-control-elapsed",
    });
  },

  start() {
    if (this.active) return;
    this.active = true;
    this.interval = setInterval(this.updateTime.bind(this), 1000);
  },

  stop() {
    if (!this.active) return;
    clearInterval(this.interval);
    this.active = false;
    this.el().innerHTML = "";
  },

  updateTime() {
    const currentTime = this.player.currentTime() * 1000;
    const missingTime = this.firstPlay - (this.startTime + this.offset);
    const elapsed = currentTime + missingTime;

    //convert seconds to HH:MM:SS
    const totalSeconds = parseInt(elapsed / 1000, 10);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor(totalSeconds / 60) % 60;
    const seconds = totalSeconds % 60;

    const time = [hours, minutes, seconds]
      .map((v) => (v < 10 ? "0" + v : v))
      .filter((v, i) => v !== "00" || i > 0)
      .join(":");

    this.el().innerHTML = time;
  },

  calculateOffset(serverTime) {
    this.serverTime = serverTime;
    this.offset = +new Date() - +new Date(this.serverTime);
  },

  setStartTime(startTime) {
    this.startTime = +new Date(startTime);
  },
});

videojs.registerComponent("Elapsed", elapsedComponent);
