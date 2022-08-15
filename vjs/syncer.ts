import videojs, { VideoJsPlayer } from "video.js";
import { useToast } from "vue-toastification";

type SyncerLevel = {
  name: number;
  threshold: number;
  pbr_max: number;
  pbr_min: number;
};

const Plugin = videojs.getPlugin("plugin");
class SyncerPlugin extends Plugin {
  enabled: boolean;
  target: number;
  toast: any;
  levels: SyncerLevel[];

  private _leveli: any;

  constructor(player: VideoJsPlayer) {
    super(player);
    this.player = player;
    this.enabled = true;
    this.target = 5000;
    this.toast = useToast();

    this.levels = [
      { name: 50, threshold: 100, pbr_max: 1.025, pbr_min: 0.975 },
      { name: 75, threshold: 150, pbr_max: 1.05, pbr_min: 0.95 },
      { name: 100, threshold: 200, pbr_max: 1.1, pbr_min: 0.9 },
      { name: 200, threshold: 300, pbr_max: 1.2, pbr_min: 0.8 },
      { name: 500, threshold: 500, pbr_max: 3, pbr_min: 0.25 },
    ];

    this.leveli = this.getLevel();

    player.addChild("Syncer");

    player.on("progress", () => {
      player.trigger("deviance", this.deviance);
      this.applySync();
    });

    player.on("loadeddata", () => this.applySync());

    player.on("keyup", (e) => {
      if (e.key === "s") this.changeLevel();
    });
  }

  disable() {
    if (!this.enabled) return;
    this.player.trigger("stopsyncing");
    this.playbackRate = 1;
    this.enabled = false;
  }

  enable() {
    if (this.enabled) return;
    this.enabled = true;
  }

  changeLevel() {
    this.leveli++;
    this.toast.clear();

    if (this.leveli > this.levels.length - 1) {
      this.leveli = -1;
      this.toast.error("Syncer is disabled");
      return this.disable();
    }

    this.toast.success(`Syncer level ${this.level.name}%`);
    this.enable();
  }

  getLevel() {
    const level = this.player.settings.syncerlevel;
    if (level < 0) this.disable();

    return level;
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

  get level() {
    return this.levels[this.leveli];
  }

  set leveli(val) {
    this.player.settings.syncerlevel = val;
    this._leveli = val;
  }

  get leveli() {
    return this._leveli;
  }

  applySync() {
    if (!this.enabled) return;

    // On first play the deviance is infinite, slow down to get to target;
    if (this.deviance === Infinity)
      return (this.playbackRate = this.level.pbr_min);

    // change playbackrate based on deviance from target
    if (Math.abs(this.deviance) > 2500) {
      this.playbackRate =
        this.deviance > 0 ? this.level.pbr_max : this.level.pbr_min;
    }

    // reset playbackrate if deviance is close to 0
    const threshold = Math.abs(this.deviance) < this.level.threshold;
    if (this.playbackRate !== 1 && threshold) {
      this.playbackRate = 1;
    }
  }
}

const Component = videojs.getComponent("Component");
const SyncerComponent = videojs.extend(Component, {
  constructor: function (player) {
    Component.apply(this, arguments);

    player.on("startsyncing", () => (this.el().style.opacity = 0.5));
    player.on("stopsyncing", () => (this.el().style.opacity = 0));
    player.on("deviance", (_, deviance) => this.updateEl(deviance));
  },

  createEl: function () {
    const el = videojs.dom.createEl("div", { className: "vjs-sync-status" });
    el.innerHTML = "🔴";
    return el;
  },

  updateEl: function (deviance) {
    this.el().innerHTML = `🔴 ${(deviance / 1000).toFixed(2)}s`;
  },
});

videojs.registerPlugin("syncer", SyncerPlugin);
videojs.registerComponent("syncer", SyncerComponent);
