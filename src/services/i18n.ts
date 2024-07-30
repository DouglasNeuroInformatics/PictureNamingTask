import i18n from "i18next";
import Backend from "i18next-http-backend";

import { experimentSettings } from "../fetchAndParse";

console.log(experimentSettings.language);
await i18n.use(Backend).init({
  backend: {
    loadPath: "/locales/{{lng}}/{{ns}}.json",
  },
  defaultNS: "translation",
  fallbackLng: "en",
  // initImmediate: true,
  lng: experimentSettings.language,
  ns: ["translation"],
  preload: ["en", "fr"],
});
// this will only work if initImmediate is set to false, because it's async
//console.log("**** i18n init");
//console.log(i18n.t("welcome"));
//console.log(i18n.t("welcome", { lng: "fr" }));
export default i18n;
