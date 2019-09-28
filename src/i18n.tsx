import i18n from "i18next";
import detector from "i18next-browser-languagedetector";
import {reactI18nextModule} from "react-i18next";

const translationEN = require("../assets/locales/en/translation.json");
// const translationRU = require("../assets/locales/ru/translation.json");
// const translationZH = require("../assets/locales/zh/translation.json");

// the translations
const resources = {
    en: {
        translation: translationEN,
    },
    // ru: {
    //     translation: translationRU,
    // },
    // zh: {
    //     translation: translationZH,
    // },
};

i18n.use(detector)
    .use(reactI18nextModule) // passes i18n down to react-i18next
    .init({
        resources,
        lng: "en",
        fallbackLng: "en", // use en if detected language is not available
        keySeparator: ".", // we do not use keys in form messages.welcome
        returnEmptyString: false,
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
