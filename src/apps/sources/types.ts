export interface NewAPISource {
    external_id: string;
    id: string,
    short_code: string;
    name: string;
    full_name: string;
    source_type: string;
    public_access: string;
    default_locale: string;
    supported_locales: string;
    website: string;
    description: string;
    custom_validation_schema: string;
}

export interface APISource extends NewAPISource{
    url: string;
    active_concepts: number,
    concepts_url: string,
    extras?: {};
}

export interface SourceState {
    source?: APISource,
}

export {};
