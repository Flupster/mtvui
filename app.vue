<template>
  <b-container fluid class="h-100">
    <player v-if="live" />
    <quotes v-else />
  </b-container>
</template>

<script setup>
const { $socket, $toast } = useNuxtApp();

const { isLive } = await $fetch(
  "https://nld1.nms.minusten.tv:8443/api/streams/live/mtv"
);

const live = ref(isLive);

$socket.on("streamInfo", (data) => {
  live.value = data.meta.isLive;
});

$socket.on("streamStart", () => {
  live.value = true;
  $toast.success("Stream has Started");
});

$socket.on("streamEnd", () => {
  live.value = false;
  $toast.error("Stream has ended");
});
</script>



