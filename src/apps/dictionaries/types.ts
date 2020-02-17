import { BaseConceptContainer, EditableConceptContainerFields } from '../../utils'

interface BaseDictionary extends BaseConceptContainer {
  preferred_source: string;
}

export interface Dictionary extends BaseDictionary {
  supported_locales: string[];
  owner_url: string;
}

interface BaseAPIDictionary extends BaseDictionary {
  id: string;
  external_id: string;
  full_name: string;
  collection_type: string;
  website: string;
  custom_validation_schema: string;
  extras: { source: string };
}

export interface NewAPIDictionary extends BaseAPIDictionary {
  supported_locales: string;
}

export interface APIDictionary extends BaseAPIDictionary {
  supported_locales: string[];
  short_code: string;
  owner: string;
  owner_type: string;
  owner_url: string;
  url: string;
  active_concepts: string;
  references: { [key: string]: string }[];
  concepts_url: string;
}

export interface DictionaryState {
  newDictionary?: APIDictionary;
  editedDictionary?: APIDictionary;
  dictionary?: APIDictionary;
  dictionaries: { items: APIDictionary[]; responseMeta?: {} }[];
  versions: APIDictionaryVersion[];
  addReferencesResults: { payload: {}; meta: [] }[];
}

export interface EditableDictionaryFields
  extends EditableConceptContainerFields {
  public_access: string;
}

export interface DictionaryVersion {
  id: string;
  released: boolean;
  description?: string;
  external_id: string;
  extras?: { [key: string]: string };
}

export interface APIDictionaryVersion extends DictionaryVersion {
  version_url: string;
  url: string;
}

const apiDictionaryToDictionary = (
  apiDictionary?: APIDictionary
): Dictionary | undefined => {
  if (!apiDictionary) return apiDictionary;

  const { url, supported_locales, ...theRest } = apiDictionary;

  return {
    supported_locales: supported_locales || [],
    ...theRest
  };
};

export { apiDictionaryToDictionary };
