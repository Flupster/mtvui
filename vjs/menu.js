import videojs from "video.js";
import "videojs-contextmenu-ui";

const Plugin = videojs.getPlugin("plugin");
class MenuPlugin extends Plugin {
  constructor(player) {
    super(player);
    player.contextmenuUI({
      excludeElements: (el) => el.tagName.toLowerCase() !== "div",
      content: [
        {
          label: "Disable Syncer",
          listener: () => player.syncer().disable(),
        },
      ],
    });
  }
}

videojs.registerPlugin("menu", MenuPlugin);
