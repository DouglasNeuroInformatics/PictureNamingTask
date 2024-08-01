import i18n from "i18next";
import Backend from "i18next-http-backend";

import { experimentSettings } from "../fetchAndParse";
//@ts-expect-error the baseUrl is being read in the loadPath
const baseUrl = import.meta.env.BASE_URL | "";

await i18n.use(Backend).init({
  backend: {
    loadPath: "{baseUrl}/locales/{{lng}}/{{ns}}.json",
  },
  defaultNS: "translation",
  fallbackLng: "en",
  lng: experimentSettings.language,
  ns: ["translation"],
  preload: ["en", "fr"],
});

await i18n.changeLanguage(i18n.resolvedLanguage);
export default i18n;
