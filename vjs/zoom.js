import videojs from "video.js";

const Plugin = videojs.getPlugin("plugin");

class ZoomPlugin extends Plugin {
  constructor(player) {
    super(player);
    this.x = 1;
    this.y = 1;
    this.scale = 0.025;

    this.video = player.el().getElementsByTagName("video")[0];
    player.on("keyup", this.onKeyUp.bind(this));
  }

  onKeyUp(e) {
    switch (e.key) {
      // Zoom out
      case "1":
        this.setZoom(this.x - this.scale, this.y - this.scale);
        break;
      // shrink height
      case "2":
        this.setZoom(this.x, this.y - this.scale);
        break;
      // shrink width
      case "4":
        this.setZoom(this.x - this.scale, this.y);
        break;
      // reset height and width
      case "5":
        this.setZoom(1, 1);
        break;
      // stretch width
      case "6":
        this.setZoom(this.x + this.scale, this.y);
        break;
      // stretch height
      case "8":
        this.setZoom(this.x, this.y + this.scale);
        break;
      // zoom in
      case "9":
        this.setZoom(this.x + this.scale, this.y + this.scale);
        break;
    }
  }

  setZoom(x, y) {
    this.x = x;
    this.y = y;
    this.video.style.transform = `scale(${x},${y})`;
  }
}

videojs.registerPlugin("zoom", ZoomPlugin);
