<template>
  <b-container fluid class="h-100">
    <div v-show="live"><player /></div>
    <div v-show="!live" class="h-100"><quotes /></div>
  </b-container>
</template>

<script setup>
const { $socket, $toast } = useNuxtApp();

const { isLive } = await $fetch(
  "https://nld1.nms.minusten.tv:8443/api/streams/live/mtv"
);

const live = ref(isLive);

$socket.on("streamStart", () => {
  live.value = true;
  $toast.success("Stream has started");
});

$socket.on("streamEnd", () => {
  live.value = false;
  $toast.error("Stream has ended");
});
</script>



