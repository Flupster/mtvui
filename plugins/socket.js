export default defineNuxtPlugin((nuxtApp) => {
  const socket = nuxtApp.$nuxtSocket({ channel: "/", persist: "socket" });
  return { provide: { socket } };
});
