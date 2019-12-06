import { BaseConceptContainer } from "../../utils";

interface BaseAPISource extends BaseConceptContainer {
  external_id: string;
  id: string;
  full_name: string;
  source_type: string;
  website: string;
  custom_validation_schema: string;
}

export interface NewAPISource extends BaseAPISource {
  supported_locales: string;
}

export interface APISource extends BaseAPISource {
  url: string;
  active_concepts: number;
  concepts_url: string;
  extras?: {};
  supported_locales: string[];
}

export interface SourceState {
  source?: APISource;
}

export {};
