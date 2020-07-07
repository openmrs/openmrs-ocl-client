import { BaseConceptContainer } from "../../utils";

interface BaseAPISource extends BaseConceptContainer {
  external_id: string;
  id: string;
  full_name: string;
  website: string;
  custom_validation_schema: string;
}

export interface NewAPISource extends BaseAPISource {
  // api expects a comma separated string for this in create/ edit data
  supported_locales: string;
}

export interface APISource extends BaseAPISource {
  source_type: string;
  url: string;
  active_concepts: number;
  concepts_url: string;
  extras?: {};
  supported_locales: string[];
  owner: string;
  owner_type: string;
  owner_url: string;
}

export interface SourceState {
    sources: { items: APISource[]; responseMeta?: {} }[];
}

export {};
