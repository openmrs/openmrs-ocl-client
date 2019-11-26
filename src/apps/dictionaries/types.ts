import { BaseConceptContainer } from '../../utils'

interface BaseDictionary extends BaseConceptContainer{
    preferred_source: string;
}

export interface Dictionary extends BaseDictionary{
    supported_locales: string[];
    owner_url: string;
}

interface BaseAPIDictionary extends BaseDictionary{
    id: string,
    external_id: string;
    full_name: string;
    collection_type: string;
    website: string;
    custom_validation_schema: string;
    extras?: { [key: string]: string | undefined };
}

export interface NewAPIDictionary extends BaseAPIDictionary{
    supported_locales: string;
}

export interface APIDictionary extends BaseAPIDictionary{
    supported_locales: string[];
    short_code: string;
    owner: string;
    owner_type: string;
    owner_url: string;
    url: string;
}

export interface DictionaryState {
    newDictionary?: APIDictionary,
    dictionary?: APIDictionary,
    dictionaries?: {items: APIDictionary[], responseMeta?: {}},
}

const apiDictionaryToDictionary = (apiDictionary?: APIDictionary): Dictionary | undefined => {
    if (!apiDictionary) return apiDictionary;

    const {
        url,
        supported_locales,
        ...theRest
    } = apiDictionary;

    return {
        supported_locales: supported_locales || [],
        ...theRest,
    };
};

export {apiDictionaryToDictionary};
