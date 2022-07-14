import videojs from "video.js";

const Button = videojs.getComponent("Button");
const mirrors = [
  "/stream.flv",
  "https://nld1.nms.minusten.tv:8443/live/mtv.flv",
];

class MirrorButton extends Button {
  constructor(player) {
    super(player);

    player.on("play", () => {
      const m = mirrors.findIndex((s) => s === player.settings.mirror) !== 0;
      if (m) this.el().classList.add("vjs-mirror-off");
    });

    this.on("click", () => {
      const ci = mirrors.findIndex((s) => s === player.settings.mirror) + 1;
      const i = ci > mirrors.length ? 0 : ci;
      player.settings.mirror = mirrors[i];
      location.reload(); // flvjs tech does not load a new src when changed reload page to force new src
    });
  }

  createEl() {
    return videojs.dom.createEl("button", {
      className: "vjs-mirror-control vjs-control vjs-button",
      innerHTML: '<i class="fa fa-cloud"></i>',
    });
  }
}

videojs.registerComponent("MirrorButton", MirrorButton);
