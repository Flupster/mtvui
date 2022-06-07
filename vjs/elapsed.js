import videojs from "video.js";

const secondsToHHMMSS = (s) => {
  const totalSeconds = parseInt(s / 1000, 10);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor(totalSeconds / 60) % 60;
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds]
    .map((v) => (v < 10 ? "0" + v : v))
    .filter((v, i) => v !== "00" || i > 0)
    .join(":");
};

const Component = videojs.getComponent("Component");
class elapsedComponent extends Component {
  constructor(player) {
    super(player);

    this.player = player;
    this.duration = null;
    this.serverTime = 0;
    this.startTime = 0;
    this.firstPlay = 0;
    this.active = false;

    this.interval = null;

    this.el().innerHTML = "";

    player.socket.on("streamInfo", (data) => {
      if (!data.meta.isLive) return;

      if (data.meta.arguments?.duration) {
        const duration = parseFloat(data.meta.arguments.duration) * 1000;
        if (!isNaN(duration)) this.duration = duration;
      }

      this.calculateOffset(data.servertime);
      this.setStartTime(data.meta.startTime);
      this.start();
    });

    player.socket.on("streamEnd", () => this.stop());

    player.on("firstplay", () => (this.firstPlay = +new Date()));
  }

  createEl() {
    return videojs.dom.createEl("div", {
      className: "vjs-control-elapsed",
    });
  }

  start() {
    if (this.active) return;
    this.active = true;
    this.interval = setInterval(this.updateTime.bind(this), 1000);
  }

  stop() {
    if (!this.active) return;
    clearInterval(this.interval);
    this.duration = null;
    this.active = false;
    this.el().innerHTML = "";
  }

  updateTime() {
    const currentTime = this.player.currentTime() * 1000;
    const missingTime = this.firstPlay - (this.startTime + this.offset);
    const elapsed = currentTime + missingTime;

    if (this.duration) {
      const time = secondsToHHMMSS(elapsed);
      const duration = secondsToHHMMSS(this.duration);
      this.el().innerHTML = `${time} / ${duration}`;
    } else {
      const time = secondsToHHMMSS(elapsed);
      this.el().innerHTML = time;
    }
  }

  calculateOffset(serverTime) {
    this.serverTime = serverTime;
    this.offset = +new Date() - +new Date(this.serverTime);
  }

  setStartTime(startTime) {
    this.startTime = +new Date(startTime);
  }
}

videojs.registerComponent("Elapsed", elapsedComponent);
