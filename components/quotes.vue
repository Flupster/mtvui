<script setup lang="ts">
import { Ref } from "@vue/reactivity";
import { DiscordQuote } from "~~/types";

const quotes: DiscordQuote[] = await $fetch("https://murcord.minusten.tv/api/discordquotes");

const quote: Ref<DiscordQuote | null> = ref(null);
let timeout: NodeJS.Timeout | null = null;

const nextQuote = (): void => {
  if (timeout) clearTimeout(timeout);
  if (quotes.length === 0) return;
  quote.value = quotes[Math.floor(Math.random() * quotes.length)];
  timeout = setTimeout(nextQuote, 15000);
};

nextQuote();
</script>

<template>
  <b-container class="d-flex align-items-center justify-content-center h-100 quotes">
    <snow />
    <b-row class="text-center quote">
      <b-col v-if="quote">
        <h3 class="mb-5 text-no-wrap">{{ quote.userName }}: {{ quote.content }}</h3>
        <hr />
        <div class="mt-5">
          <b-img v-if="quote.reactionEmojiUrl" :src="quote.reactionEmojiUrl" />
          <h3 v-else>{{ quote.reaction }}</h3>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<style scoped lang="scss">
.quotes {
  z-index: 10;
}
</style>
