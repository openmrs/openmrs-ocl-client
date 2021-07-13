import {
  BaseConceptContainer,
  EditableConceptContainerFields,
  Extras,
  Version
} from "../../utils";
import { pick } from "lodash";

interface BaseDictionary extends BaseConceptContainer {
  preferred_source: string;
  extras?: { source?: string } | Omit<Extras, "source">;
}

export interface Dictionary extends BaseDictionary {
  supported_locales: string[];
  owner_url: string;
  owner?: string;
}

interface BaseAPIDictionary extends BaseDictionary {
  id: string;
  external_id: string;
  full_name: string;
  website: string;
  custom_validation_schema: string;
  extras: { source: string } | Omit<Extras, "source">;
}

export interface NewAPIDictionary extends BaseAPIDictionary {
  supported_locales: string;
  collection_type: string;
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
  showOnlyVerified: boolean;
}

export interface EditableDictionaryFields
  extends EditableConceptContainerFields {
  public_access?: string;
  extras?: { source?: string } | Omit<Extras, "source">;
}

export interface DictionaryVersion extends Version {}

export interface APIDictionaryVersion extends DictionaryVersion {
  version_url: string;
  url: string;
}

export type ImportMetaData = {
  dictionary: string;
  dateTime: string;
};

export type CopyableDictionary = Pick<
  APIDictionary,
  | "description"
  | "default_locale"
  | "supported_locales"
  | "owner_url"
  | "preferred_source"
  | "public_access"
  | "references"
>;

export const dictionaryToCopyableDictionary = (
  dictionary: APIDictionary
): CopyableDictionary => {
  const newDictionary = pick(dictionary, [
    "description",
    "default_locale",
    "supported_locales",
    "owner_url",
    "preferred_source",
    "public_access",
    "references"
  ]);

  newDictionary.supported_locales = newDictionary.supported_locales ?? [];

  return newDictionary;
};

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
