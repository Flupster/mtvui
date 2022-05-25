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
    const scale = e.altKey ? this.scale / 2 : this.scale;
    
    switch (e.key) {
      // Zoom out
      case "1":
        this.setZoom(this.x - scale, this.y - scale);
        break;
      // shrink height
      case "2":
        this.setZoom(this.x, this.y - scale);
        break;
      // shrink width
      case "4":
        this.setZoom(this.x - scale, this.y);
        break;
      // reset height and width
      case "5":
        this.setZoom(1, 1);
        break;
      // stretch width
      case "6":
        this.setZoom(this.x + scale, this.y);
        break;
      // 21:9 aspect ratio zoom
      case "7":
        this.setZoom(1.3, 1.3);
        break;
      // stretch height
      case "8":
        this.setZoom(this.x, this.y + scale);
        break;
      // zoom in
      case "9":
        this.setZoom(this.x + scale, this.y + scale);
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
