export interface BaseAPICollection {
    id: string;
    short_code: string;
    external_id: string;
    name: string;
    full_name: string;
    collection_type: string;
    public_access: string;
    default_locale: string;
    website: string;
    description: string;
    custom_validation_schema: string;
}

export interface NewAPICollection extends BaseAPICollection{
    supported_locales: string;
}

export interface APICollection extends BaseAPICollection {
    extras?: {};
    active_concepts: number;
    concepts_url: string;
    url: string;
    supported_locales: string[];
}

export interface CollectionState {
    collection?: APICollection,
}

export {};
