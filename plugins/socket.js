export default defineNuxtPlugin((nuxtApp) => {
  const socket = nuxtApp.$nuxtSocket({
    channel: "/",
    transports: ["websocket"],
  });

  return { provide: { socket } };
});
