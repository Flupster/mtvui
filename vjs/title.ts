import videojs, { VideoJsPlayer } from "video.js";

const Component = videojs.getComponent("Component");

class TitleBar extends Component {
  constructor(player: VideoJsPlayer) {
    super(player);

    player.socket.on("streamInfo", (info) => {
      if (!info.meta.arguments?.title) return;
      this.updateTitle(info.meta.arguments.title);
    });

    player.socket.on("streamEnd", this.updateTitle.bind(this));
  }

  createEl() {
    return videojs.dom.createEl("div", { className: "vjs-title-bar" });
  }

  updateTitle(title) {
    videojs.dom.emptyEl(this.el());
    videojs.dom.appendContent(this.el(), title);
  }
}

videojs.registerComponent("TitleBar", TitleBar);
