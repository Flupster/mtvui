import { defineStore } from "pinia";

export const useStore = defineStore("settings", {
  state: () => ({
    volume: 1,
    syncerlevel: 2,
    mirror: "/stream.flv",
    remainingview: true,
  }),
  persist: {
    key: "video.settings",
    storage: window.localStorage,
  },
});
