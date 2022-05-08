<script setup>
import videojs from "video.js";
import "videojs-flvjs-es6";
import vjsPlugins from "../vjs";
const { $socket } = useNuxtApp();

const src = {
  type: "video/x-flv",
  src: `https://nld1.nms.minusten.tv:8443/live/mtv.flv`,
};

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

  vjsPlugins(player);

  $socket.on("streamStart", () => {
    player.src(src);
    player.play();
  });

  $socket.on("streamEnd", () => player.src(""));

  player.src(src);
  player.interact().play();
});
</script>

<template>
  <video id="video" class="video-js" preload="auto" controls></video>
</template>