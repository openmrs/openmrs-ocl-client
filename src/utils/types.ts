export interface Option {
  label: string;
  value: string;
}

export interface OptionResponse {
  options: Option[];
  hasMore: boolean;
  additional: {};
}

export interface BaseConceptContainer {
  name: string;
  short_code: string;
  description: string;
  public_access: string;
  default_locale: string;
}

export interface EditableConceptContainerFields {
  description?: string;
  name?: string;
  supported_locales?: string;
  default_locale?: string;
  preferred_source?: string;
}

export interface Version {
  id: string;
  released: boolean;
  description?: string;
  external_id: string;
  extras?: { [key: string]: string };
  created_on?: string;
}