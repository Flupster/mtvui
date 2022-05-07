<script setup>
import videojs from "video.js";
import "videojs-flvjs-es6";
import vjsPlugins from "../vjs";
const { $socket } = useNuxtApp();

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

  player.src({
    type: "video/x-flv",
    src: `https://nld1.nms.minusten.tv:8443/live/mtv.flv`,
  });

  vjsPlugins(player);

  $socket.on("streamInfo", (info) => {
    if (info.meta.isLive && player.paused()) player.play();
  });

  $socket.on("streamStart", () => player.play());
  $socket.on("streamEnd", () => player.pause());

  player.interact().play();
});
</script>

<template>
  <video id="video" class="video-js" preload="auto" controls></video>
</template>