import { MAP_TYPE_CONCEPT_SET, MAP_TYPE_Q_AND_A } from "../../utils";

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
  to_concept_url?: string | null; // internal mapping
  to_source_url?: string; // external mapping
  to_concept_code?: string; // external mapping
  to_concept_name?: string | null;
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

export interface Extras {
  hi_absolute?: number;
  hi_critical?: number;
  hi_normal?: number;
  low_normal?: number;
  low_critical?: number;
  low_absolute?: number;
  units?: string;
  precise?: boolean;
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
  extras: Extras | null;
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
  source_url: string;
}

export interface ConceptsState {
  concept?: APIConcept;
  concepts: { items: APIConcept[]; responseMeta?: {} };
  activeConcepts: { items: APIConcept[]; responseMeta?: {} };
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
  convertNames = true
): Concept | undefined => {
  if (!apiConcept) return apiConcept;

  let { names, descriptions, display_name, ...theRest } = apiConcept;
  descriptions = descriptions || [];

  let sortedNames = names.slice().sort(sortConceptName);
  let sortedDescriptions = descriptions.slice().sort(sortConceptDescriptions);

  return {
    names: convertNames ? apiNamesToName(sortedNames) : sortedNames,
    descriptions: sortedDescriptions,
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

const sortConceptName = (n1: ConceptName, n2: ConceptName) => {
  if (typeof n1 === 'undefined') {
    return (typeof n2 === 'undefined') ? 0 : 1;
  }

  if (typeof n2 === 'undefined') {
    return -1;
  }

  if (n1.locale !== n2.locale) {
    return n1.locale < n2.locale ? -1 : 1;
  }
  
  if (n1.locale_preferred !== n2.locale_preferred) {
    return n1.locale_preferred ? -1 : 1;
  }

  if (n1.name_type !== n2.name_type) {
    if (n1.name_type === "FULLY_SPECIFIED") {
      return -1;
    } else if (n2.name_type === "FULLY_SPECIFIED") {
      return 1;
    }
  }

  if (n1.name !== n2.name) {
    return n1.name < n2.name ? -1 : 1;
  }

  return 0;
}

const sortConceptDescriptions = (d1: ConceptDescription, d2: ConceptDescription) => {
  if (typeof d1 === 'undefined') {
    return (typeof d2 === 'undefined') ? 0 : 1;
  }

  if (typeof d2 === 'undefined') {
    return -1;
  }

  if (d1.locale !== d2.locale) {
    return d1.locale < d2.locale ? -1 : 1;
  }
  
  if (d1.locale_preferred !== d2.locale_preferred) {
    return d1.locale_preferred ? -1 : 1;
  }

  if (d1.description !== d2.description) {
    return d1.description < d2.description ? -1 : 1;
  }

  return 0;
}

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
