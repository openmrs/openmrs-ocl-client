export interface APISource {
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
    extras: {};

    url?: string;
}

export interface SourceState {
    source?: APISource,
}

export {};
