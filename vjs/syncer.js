import videojs from "video.js";

class Syncer {
  constructor(player, component) {
    this.player = player;
    this.component = component;

    this.target = 5000;

    player.on("progress", () => this.applySync());
    player.on("loadeddata", () => this.applySync());
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
      this.component.show(rate !== 1);
      this.player.playbackRate(rate);
    }
  }

  applySync() {
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
    this.player = player;
    this.syncer = new Syncer(player, this);
  },

  createEl: function () {
    const el = videojs.dom.createEl("div", { className: "vjs-sync-status" });
    el.innerHTML = "🔴";
    return el;
  },

  show(syncing) {
    this.el().style.opacity = syncing ? 1 : 0;
  },
});

videojs.registerComponent("Syncer", SyncerComponent);
