import { BaseConceptContainer } from '../../utils'

export interface BaseAPICollection extends BaseConceptContainer{
    id: string;
    external_id: string;
    full_name: string;
    collection_type: string;
    website: string;
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
