import { createI18n } from "vue-i18n";
import zhCN from "./zh-CN";
import zhTW from "./zh-TW";
import en from "./en";
import ja from "./ja";
import ko from "./ko";
import es from "./es";
import fr from "./fr";
import de from "./de";

const i18n = createI18n({
  legacy: false,
  locale: "zh-CN",
  fallbackLocale: "en",
  messages: {
    "zh-CN": zhCN,
    "zh-TW": zhTW,
    en,
    ja,
    ko,
    es,
    fr,
    de,
  },
});

export default i18n;
