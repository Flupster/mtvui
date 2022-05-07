import videojs from "video.js";

const Component = videojs.getComponent("Component");
const TitleBar = videojs.extend(Component, {
  constructor: function (player) {
    Component.apply(this, arguments);

    // Set title from socket message
    player.socket.on("streamInfo", (info) => {
      if (!info.meta.arguments?.title) return;
      this.updateTitle(info.meta.arguments.title);
    });

    player.socket.on("streamEnd", () => this.updateTitle());
  },

  createEl: function () {
    return videojs.dom.createEl("div", { className: "vjs-title-bar" });
  },

  updateTitle: function (title) {
    videojs.dom.emptyEl(this.el());
    videojs.dom.appendContent(this.el(), title);
  },
});

videojs.registerComponent("TitleBar", TitleBar);
