interface BaseAPISource {
    external_id: string;
    id: string,
    short_code: string;
    name: string;
    full_name: string;
    source_type: string;
    public_access: string;
    default_locale: string;
    website: string;
    description: string;
    custom_validation_schema: string;
}

export interface NewAPISource extends BaseAPISource{
    supported_locales: string;
}

export interface APISource extends BaseAPISource {
    url: string;
    active_concepts: number,
    concepts_url: string,
    extras?: {};
    supported_locales: string[];
}

export interface SourceState {
    source?: APISource,
}

export {};
