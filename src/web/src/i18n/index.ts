import { initReactI18next } from "react-i18next";
import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "../../public/locales/en/translation.json";
import fi from "../../public/locales/fi/translation.json";

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
	fi: {
		translation: fi,
	},
	en: {
		translation: en,
	},
};

i18n
	.use(LanguageDetector)
	.use(initReactI18next) // passes i18n down to react-i18next
	.init({
		resources,
		ns: ["translation"],
		fallbackLng: "fi",
		saveMissing: true,
		interpolation: {
			escapeValue: false, // react already safes from xss
		},
	});

export default i18n;
