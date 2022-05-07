<script setup>
import videojs from "video.js";
import "videojs-flvjs-es6";
import vjsPlugins from "../vjs";
const { $socket } = useNuxtApp();

onMounted(() => {
  const player = videojs("video", { techOrder: ["flvjs"] });
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