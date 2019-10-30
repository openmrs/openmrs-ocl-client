export interface NewAPICollection {
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
}

export interface APICollection extends NewAPICollection{
    extras?: {};
    active_concepts: number;
    concepts_url: string;
    url: string;
}

export interface CollectionState {
    collection?: APICollection,
}

export {};
