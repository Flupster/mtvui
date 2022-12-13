<template>
  <b-container fluid class="h-100">
    <div v-show="live">
      <player />
    </div>

    <div v-show="!live" class="h-100">
      <lightsout v-if="game" />
      <quotes v-else />
    </div>
  </b-container>
</template>

<script setup lang="ts">
import { Ref } from "vue";
import { StreamMeta } from "./types";
import { version } from "./package.json";

console.log("Loading MTV version: ", version);

const { $socket, $toast } = useNuxtApp();

const { isLive }: StreamMeta = await $fetch("https://minusten.tv/api/live");
const live: Ref<boolean> = ref(isLive);

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

const game: boolean = Math.random() > 0.8;
</script>
