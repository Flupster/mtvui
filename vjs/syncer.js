import videojs from "video.js";
import { useToast } from "vue-toastification";

const Plugin = videojs.getPlugin("plugin");
class SyncerPlugin extends Plugin {
  constructor(player) {
    super(player);
    this.player = player;
    this.enabled = true;
    this.target = 5000;
    this.toast = useToast();

    player.addChild("Syncer");
    player.on("progress", () => this.applySync());
    player.on("loadeddata", () => this.applySync());
    player.on("keyup", (e) => {
      if (e.key === "s") this.enabled ? this.disable() : this.enable();
    });
  }

  disable() {
    if (!this.enabled) return;
    this.toast.error("Syncer is disabled");
    this.player.trigger("stopsyncing");
    this.playbackRate = 1;
    this.enabled = false;
  }

  enable() {
    if (this.enabled) return;
    this.toast.success("Syncer is enabled");
    this.enabled = true;
  }

  // calculate time from live edge
  get desync() {
    const currentTime = this.player.currentTime();
    const liveCurrentTime = this.player.liveTracker.liveCurrentTime();
    return (liveCurrentTime - currentTime) * 1000;
  }

  // calculate time from target
  get deviance() {
    return this.desync - this.target;
  }

  // get players playbackrate
  get playbackRate() {
    return this.player.playbackRate();
  }

  // don't set playbackrate if it's already set
  set playbackRate(rate) {
    if (this.playbackRate !== rate) {
      this.player.trigger(rate !== 1 ? "startsyncing" : "stopsyncing");
      this.player.playbackRate(rate);
    }
  }

  applySync() {
    if (!this.enabled) return;

    // On first play the deviance is infinite, slow down to get to target;
    if (this.deviance === Infinity) return (this.playbackRate = 0.9);

    // change playbackrate based on deviance from target
    if (Math.abs(this.deviance) > 2500) {
      this.playbackRate = this.deviance > 0 ? 1.1 : 0.9;
    }

    // reset playbackrate if deviance is close to 0
    if (this.playbackRate !== 1 && Math.abs(this.deviance) < 250) {
      this.playbackRate = 1;
    }
  }
}

const Component = videojs.getComponent("Component");
const SyncerComponent = videojs.extend(Component, {
  constructor: function (player) {
    Component.apply(this, arguments);

    player.on("startsyncing", () => (this.el().style.opacity = 1));
    player.on("stopsyncing", () => (this.el().style.opacity = 0));
  },

  createEl: function () {
    const el = videojs.dom.createEl("div", { className: "vjs-sync-status" });
    el.innerHTML = "🔴";
    return el;
  },
});

videojs.registerPlugin("syncer", SyncerPlugin);
videojs.registerComponent("syncer", SyncerComponent);
