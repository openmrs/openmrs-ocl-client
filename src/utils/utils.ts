import {locales} from "./constants";

const findLocale = (localeCode: string, fallback = 'en') => locales.find(
    currentLocale => currentLocale.value === localeCode,
) || locales.find(currentLocale => currentLocale.value === fallback);

const getPrettyError = (errors: {[key: string]: string[] | undefined} | undefined, field?: string) => {
    if (!errors) return;

    const errorList: string[] | undefined = field ? errors[field] : errors['__all__'];
    if (!errorList) return;

    return errorList.join(', ');
};

export {findLocale, getPrettyError}
