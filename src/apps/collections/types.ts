export interface APICollection {
    id: string;
    short_code: string;
    external_id: string;
    name: string;
    full_name: string;
    collection_type: string;
    public_access: string;
    default_locale: string;
    supported_locales: string;
    website: string;
    description: string;
    custom_validation_schema: string;
    extras: {};

    url?: string;
}

export interface CollectionState {
    collection?: APICollection,
}

export {};
