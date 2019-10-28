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

export interface APIDictionary {
    id: string,
    short_code: string;
    external_id: string;
    name: string;
    full_name: string;
    collection_type: string;
    public_access: string;
    default_locale: string;
    supported_locales: string;
    preferred_source: string;
    website: string;
    description: string;
    custom_validation_schema: string;
    extras: {};
    url?: string;
}

export {}
