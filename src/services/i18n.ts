import i18n from "i18next";
import Backend from "i18next-http-backend";
import { experimentSettings } from "../fetchAndParse";

i18n.use(Backend).init({
  initImmediate: false,
  lng: experimentSettings.language,
  fallbackLng: "en",
  preload: ["en", "fr"],
  ns: ["translation"],
  defaultNS: "translation",
  backend: {
    loadPath: "../translations/{{lng}}/{{ns}}.json",
  },
});
// this will only work if initImmediate is set to false, because it's async
console.log("**** i18n init");
console.log(i18n.t("welcome"));
console.log(i18n.t("welcome", { lng: "fr" }));
export default i18n;
