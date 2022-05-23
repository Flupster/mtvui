<script setup>
const quotes = await $fetch("https://murcord.minusten.tv/api/discordquotes");
const quote = ref({});
let timeout = null;

const nextQuote = () => {
  clearTimeout(timeout);
  quote.value = quotes[Math.floor(Math.random() * quotes.length)];
  timeout = setTimeout(nextQuote, 15000);
};

nextQuote();
</script>

<template>
  <b-container class="d-flex align-items-center justify-content-center h-100">
    <draw />
    <b-row class="text-center quote">
      <b-col>
        <h3 class="mb-5 text-no-wrap">
          {{ quote.userName }}: {{ quote.content }}
        </h3>
        <hr />
        <div class="mt-5">
          <b-img v-if="quote.reactionEmojiUrl" :src="quote.reactionEmojiUrl" />
          <h3 v-else>{{ quote.reaction }}</h3>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>