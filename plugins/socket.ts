import { defineNuxtPlugin } from "#app";

export default defineNuxtPlugin((nuxtApp) => {
  const socket = nuxtApp.$nuxtSocket({
    channel: "/",
    transports: ["websocket"],
  });

  window.$socket = socket;

  return { provide: { socket } };
});
