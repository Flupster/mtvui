<script setup>
import { useStore } from "@/stores/video";
import videojs from "video.js";
import "videojs-flvjs-es6";
import vjsPlugins from "../vjs";
const { $socket } = useNuxtApp();

const settings = useStore()
const src = { type: "video/x-flv", src: settings.mirror };

const videoOptions = {
  techOrder: ["flvjs", "html5"],
  flvjs: {
    mediaDataSource: {
      isLive: true,
      cors: true,
      withCredentials: false,
    },
  },
};

onMounted(() => {
  const player = videojs("video", videoOptions);
  player.socket = $socket;
  player.settings = settings;

  vjsPlugins(player);

  $socket.on("streamStart", () => {
    player.src(src);
    player.play();
  });

  $socket.on("streamEnd", () => player.pause());

  player.src(src);
  player.interact().play();
});
</script>

<template>
  <video id="video" class="video-js" preload="auto" controls></video>
</template>