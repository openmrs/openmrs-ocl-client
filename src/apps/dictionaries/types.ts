export interface Dictionary {
    dictionaryName: string;
    shortCode: string;
    description: string;
    preferredSource: string;
    ownerUrl: string;
    visibility: string;
    preferredLanguage: string;
    otherLanguages: string[];
}

interface BaseAPIDictionary {
    id: string,
    short_code: string;
    external_id: string;
    name: string;
    full_name: string;
    collection_type: string;
    public_access: string;
    default_locale: string;
    preferred_source: string;
    website: string;
    description: string;
    custom_validation_schema: string;
    extras?: { [key: string]: string | undefined };
    url?: string;
    owner_url?: string,
}

export interface NewAPIDictionary extends BaseAPIDictionary{
    supported_locales: string;
}

export interface APIDictionary extends BaseAPIDictionary{
    supported_locales: string[];
}

export interface DictionaryState {
    newDictionary?: APIDictionary,
    dictionary?: APIDictionary,
}

const apiDictionaryToDictionary = (apiDictionary?: APIDictionary): Dictionary | undefined => {
    if (!apiDictionary) return apiDictionary;

    const {
        short_code,
        name,
        public_access,
        default_locale,
        supported_locales,
        preferred_source,
        description,
        owner_url = '',
    } = apiDictionary;

    return {
        description: description,
        dictionaryName: name,
        otherLanguages: supported_locales,
        ownerUrl: owner_url,
        preferredLanguage: default_locale,
        preferredSource: preferred_source,
        shortCode: short_code,
        visibility: public_access,
    };
};

export {apiDictionaryToDictionary};
