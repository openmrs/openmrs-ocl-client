import {locales} from "./constants";

export const findLocale = (localeCode: string, fallback = 'en') => locales.find(
    currentLocale => currentLocale.value === localeCode,
) || locales.find(currentLocale => currentLocale.value === fallback);
