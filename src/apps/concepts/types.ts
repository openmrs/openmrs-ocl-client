import { MAP_TYPE_CONCEPT_SET, MAP_TYPE_Q_AND_A } from '../../utils'

export interface ConceptName {
    name: string,
    locale: string,
    external_id: string,
    locale_preferred: boolean,
    name_type: string | null,
}

export interface ConceptDescription {
    description: string,
    locale: string,
    external_id: string,
    locale_preferred: boolean,
}

export interface Mapping {
    map_type: string,
    external_id: string,
    from_concept_url: string,
    to_concept_url?: string, // internal mapping
    to_source_url?: string, // external mapping
    to_concept_code?: string, // external mapping
    to_concept_name?: string,
    url?: string,
    retired?: boolean,
}

export interface APIMapping extends Mapping{
    url: string,
    retired: boolean,
}

export interface BaseConcept {
    id: string,
    external_id: string,
    concept_class: string,
    datatype: string,
    names: ConceptName[],
    descriptions: ConceptDescription[],
}

export interface Concept extends BaseConcept {
    answers: Mapping[],
    sets: Mapping[],
    mappings: Mapping[],
}

export interface APIConcept extends BaseConcept{
    display_name: string,
    url: string,
    mappings: APIMapping[],
}

export interface ConceptsState {
    newConcept?: APIConcept,
    concept?: APIConcept,
}

const apiConceptToConcept = (apiConcept: APIConcept|undefined): Concept|undefined => {
  if (!apiConcept) return apiConcept;

  const {mappings, url, display_name, ...baseConcept} = apiConcept;
  return {
      ...baseConcept,
      answers: mappings.filter(mapping => mapping.map_type === MAP_TYPE_Q_AND_A.value),
      sets: mappings.filter(mapping => mapping.map_type === MAP_TYPE_CONCEPT_SET.value),
      mappings: mappings.filter(mapping => mapping.map_type !== MAP_TYPE_Q_AND_A.value && mapping.map_type !== MAP_TYPE_CONCEPT_SET.value),
  };
};

export {
    apiConceptToConcept,
};
