import i18n from "i18next";
import Backend from "i18next-http-backend";

import { experimentSettings } from "../fetchAndParse";

await i18n.use(Backend).init({
  backend: {
    loadPath: "/locales/{{lng}}/{{ns}}.json",
  },
  defaultNS: "translation",
  fallbackLng: "en",
  lng: experimentSettings.language,
  ns: ["translation"],
  preload: ["en", "fr"],
});
export default i18n;
