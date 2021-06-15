export interface Option {
  label: any;
  value: string;
}

export interface OptionResponse {
  options: Option[];
  hasMore: boolean;
  additional: {};
}

export interface Extras {
  [key: string]: string | undefined;
}

export interface BaseConceptContainer {
  name: string;
  short_code: string;
  description: string;
  public_access: string;
  default_locale: string;
  extras?: Extras;
}

export interface EditableConceptContainerFields {
  description?: string;
  name?: string;
  supported_locales?: string;
  default_locale?: string;
  preferred_source?: string;
  public_access?: string;
}

export interface Version {
  id: string;
  released: boolean;
  description?: string;
  external_id: string;
  extras?: Extras;
  created_on?: string;
}
