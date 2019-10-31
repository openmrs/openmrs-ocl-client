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
    to_concept_url: string, // internal mapping
    to_source_url: string, // external mapping
    to_concept_code: string, // external mapping
    to_concept_name: string, // external mapping
}

export interface Concept {
    id: string,
    external_id: string,
    concept_class: string,
    datatype: string,
    names: ConceptName[],
    descriptions: ConceptDescription[],
    mappings: Mapping[],
}
