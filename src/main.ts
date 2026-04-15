import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "./router";
import i18n from "./i18n";
import App from "./App.vue";
import "./styles/global.css";
import "flag-icons/css/flag-icons.min.css";

import { useGamesStore } from "./stores/games";
import { useSettingsStore } from "./stores/settings";
import { LOCALE_CODES } from "./i18n/locales";

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);
app.use(router);
app.use(i18n);

const settingsStore = useSettingsStore(pinia);
Promise.allSettled([
  settingsStore.init(),
  useGamesStore(pinia).init(),
]).finally(() => {
  const saved = settingsStore.settings.locale;
  if (saved && LOCALE_CODES.includes(saved)) {
    i18n.global.locale.value = saved as typeof i18n.global.locale.value;
  }
  app.mount("#app");
});
