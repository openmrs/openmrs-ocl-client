import { MAP_TYPE_CONCEPT_SET, MAP_TYPE_Q_AND_A } from '../../utils'

export interface ConceptName {
  name: string;
  locale: string;
  external_id: string;
  locale_preferred: boolean;
  name_type: string | null;
}

export interface ConceptDescription {
  description: string;
  locale: string;
  external_id: string;
  locale_preferred: boolean;
}

export interface Mapping {
  map_type: string;
  external_id: string;
  from_concept_url: string;
  to_concept_url?: string; // internal mapping
  to_source_url?: string; // external mapping
  to_concept_code?: string; // external mapping
  to_concept_name?: string;
  url?: string;
  retired?: boolean;
}

export interface APIMapping extends Mapping {
  to_concept_code: string;
  url: string;
  retired: boolean;
}

export interface InternalAPIMapping extends APIMapping {
  to_concept_url: string;
}

export interface BaseConcept {
  id: string;
  external_id: string;
  concept_class: string;
  datatype: string;
  names: ConceptName[];
  descriptions: ConceptDescription[];
  url?: string;
  version_url?: string;
}

export interface Concept extends BaseConcept {
  answers: Mapping[];
  sets: Mapping[];
  mappings: Mapping[];
  retired: boolean;
}

export interface APIConcept extends BaseConcept {
  display_name: string;
  url: string;
  version_url: string;
  mappings: APIMapping[];
  retired: boolean;
}

export interface ConceptsState {
  concept?: APIConcept;
  concepts: { items: APIConcept[]; responseMeta?: {} };
  mappings: APIMapping[];
}

const apiNamesToName = (names: ConceptName[]) =>
  names.map((name: ConceptName) => ({
    ...name,
    name_type: name.name_type === null ? "null" : name.name_type // api represents 'Synonym' name_type as null
  }));

const apiConceptToConcept = (
  apiConcept: APIConcept | undefined,
  mappings: APIMapping[] = [],
  convertNames = true,
): Concept | undefined => {
  if (!apiConcept) return apiConcept;

  let { names, descriptions, display_name, ...theRest } = apiConcept;
  descriptions = descriptions || [];

  return {
    names: convertNames ? apiNamesToName(names) : names,
    descriptions,
    ...theRest,
    answers: mappings.filter(
      mapping => mapping.map_type === MAP_TYPE_Q_AND_A.value
    ),
    sets: mappings.filter(
      mapping => mapping.map_type === MAP_TYPE_CONCEPT_SET.value
    ),
    mappings: mappings.filter(
      mapping =>
        mapping.map_type !== MAP_TYPE_Q_AND_A.value &&
        mapping.map_type !== MAP_TYPE_CONCEPT_SET.value
    )
  };
};

export type SortableField =
  | "bestMatch"
  | "lastUpdate"
  | "name"
  | "id"
  | "datatype"
  | "conceptClass";

export interface OptionalQueryParams {
  q?: string;
  page?: number;
  sortDirection?: "sortAsc" | "sortDesc";
  sortBy?: SortableField;
  limit?: number;
  classFilters?: string[];
  dataTypeFilters?: string[];
  sourceFilters?: string[];
  addToDictionary?: string;
}

export interface QueryParams {
  q: string;
  page: number;
  sortDirection: "sortAsc" | "sortDesc";
  sortBy: SortableField;
  limit: number;
}

export { apiConceptToConcept };
