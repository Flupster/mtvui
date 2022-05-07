import videojs from "video.js";

const Component = videojs.getComponent("Component");
const SyncerComponent = videojs.extend(Component, {
  constructor: function (player) {
    Component.apply(this, arguments);
    this.active = true;
    this.player = player;
    this.target = 3;
    this.desync = 3;
    this.desyncms = 3000;
    this.playbackRate = 1;
    this.lastChunk = +new Date();
    this.syncing = false;
    this.lastSync = +new Date();

    this.player.on("progress", this.onPlayerProgress.bind(this));
    this.player.on("firstplay", this.onFirstPlay.bind(this));
  },

  createEl: function () {
    return videojs.dom.createEl("div", { className: "vjs-sync-status" });
  },

  onFirstPlay() {
    setTimeout(() => (this.syncing = true), 5000);
  },

  onPlayerProgress() {
    this.lastChunk = +new Date();

    if (this.active) {
      this.handleSyncing();
    }
  },

  handleSyncing() {
    const currentTime = this.player.currentTime();
    const liveCurrentTime = this.player.liveTracker.liveCurrentTime();
    this.desync = liveCurrentTime - currentTime;
    this.desyncms = this.desync * 1000;

    const oldplaybackrate = this.playbackRate;
    if (!this.syncing && Math.abs(this.desync - this.target) > 2) {
      console.log("Out of sync with live, trying to resync!");
      this.syncing = true;
    }

    if (this.syncing) {
      if (Math.abs(this.desync - this.target) < 0.25) {
        this.playbackRate = 1;
        this.syncing = false;
        this.lastSync = +new Date();
        console.log("Sync Success:", this.desync);
      } else if (this.desync > this.target) {
        this.playbackRate = 1.1;
      } else {
        this.playbackRate = 0.9;
      }
    }

    if (oldplaybackrate !== this.playbackRate) {
      console.log("Playback rate changed:", this.playbackRate);
      this.player.playbackRate(this.playbackRate);
    }

    this.changeUI();
  },

  enable() {
    this.active = true;
  },

  disable() {
    this.active = false;
  },

  changeUI() {
    videojs.dom.emptyEl(this.el());

    if (this.syncing) {
      return videojs.dom.appendContent(this.el(), " 🔴 ");
    }

    if (!this.syncing && +new Date() - this.lastSync < 3000) {
      return videojs.dom.appendContent(this.el(), " 🔵 ");
    }

    return videojs.dom.appendContent(this.el(), "");
  },
});

videojs.registerComponent("Syncer", SyncerComponent);
