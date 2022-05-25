<template>
  <b-container fluid class="h-100">
    <div v-show="live"><player /></div>
    <div v-show="!live" class="h-100"><quotes /></div>
  </b-container>
</template>

<script setup>
const { $socket, $toast } = useNuxtApp();

const { isLive } = await $fetch("/api/live");

const live = ref(isLive);

$socket.on("streamStart", () => {
  live.value = true;
  $toast.success("Stream has started");
});

$socket.on("streamEnd", () => {
  live.value = false;
  $toast.error("Stream has ended");
});

$socket.on("streamInfo", (e) => {
  const streamTitle = e.meta.arguments?.title;
  const title = streamTitle ? `Minusten.TV - ${streamTitle}` : "Minusten.TV";
  useHead({ title });
});
</script>
