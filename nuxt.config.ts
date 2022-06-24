import { defineNuxtConfig } from "nuxt";

export default defineNuxtConfig({
  ssr: false,
  buildModules: ["@pinia/nuxt"],
  modules: ["bootstrap-vue-3/nuxt", "nuxt-socket-io"],
  css: [
    "bootstrap/dist/css/bootstrap.css",
    "video.js/dist/video-js.css",
    "~/assets/style.css",
    "@fortawesome/fontawesome-free/css/all.css",
  ],
  io: { sockets: [{ name: "main", url: process.env.SOCKETIO_URL }] },
  app: {
    head: {
      title: "Minusten.TV",
      viewport: "width=device-width, initial-scale=1, maximum-scale=1",
      charset: "utf-8",
      meta: [
        {
          name: "description",
          content: "Streaming movies with your friends :smile:",
        },
      ],
    },
  },
  publicRuntimeConfig: {
    LIVE_URL: process.env.LIVE_URL,
    FLV_URL: process.env.FLV_URL,
  },
});
