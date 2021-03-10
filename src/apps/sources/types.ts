import {BaseConceptContainer, EditableConceptContainerFields, Version} from "../../utils";

interface BaseSource extends BaseConceptContainer {
  extras?: { source?: string };
}

export interface Source extends BaseSource {
  supported_locales: string[];
  website?: string;
  source_type: string;
  owner_url?:string;
  owner?: string;
}
interface BaseAPISource extends BaseConceptContainer {
  external_id: string;
  id: string;
  full_name: string;
  website?: string;
  custom_validation_schema: string;
}

export interface NewAPISource extends BaseAPISource {
  // api expects a comma separated string for this in create/ edit data
  supported_locales: string;
  owner_url: string;
  source_type?:string;
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

export interface SourceVersion extends Version{
}

export interface SourceState {
  sources: { items: APISource[]; responseMeta?: {} }[];
  source?: APISource;
  newSource?: APISource;
  versions: APISourceVersion[];
}
export interface APISourceVersion extends SourceVersion {
  version_url: string;
  url: string;
}

export interface EditableSourceFields
    extends EditableConceptContainerFields {
  public_access?: string;
  source_type?: string;
}

const apiSourceToSource = (apiSource?: APISource): Source | undefined => {
  if (!apiSource) return apiSource;

  const { url, supported_locales, ...theRest } = apiSource;

  return {
    supported_locales: supported_locales || [],
    ...theRest,
  };
};

export { apiSourceToSource };
