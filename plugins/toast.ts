import { defineNuxtPlugin } from "#app";
import Toast, { useToast } from "vue-toastification";

import "vue-toastification/dist/index.css";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Toast, { pauseOnFocusLoss: false });
  return { provide: { toast: useToast() } };
});
