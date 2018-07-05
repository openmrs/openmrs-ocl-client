export default {
  id: '146869',
  external_id: '146869AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
  concept_class: 'Diagnosis',
  datatype: 'N/A',
  retired: false,
  source: 'CIEL',
  owner: 'CIEL',
  owner_type: 'Organization',
  owner_url: '/orgs/CIEL/',
  display_name: 'Bronze Diabetes',
  display_locale: 'en',
  version: '5835c0e2955c3c0007e5fb79',
  mappings: null,
  is_latest_version: true,
  locale: null,
  version_url: '/orgs/CIEL/sources/CIEL/concepts/146869/5835c0e2955c3c0007e5fb79/',
  url: '/orgs/CIEL/sources/CIEL/concepts/146869/',
};

export const mockConceptStore = {
  concepts: {
    concepts: [],
    loading: false,
    dictionaryConcepts: [],
    filteredSources: ['dev-col', 'MapTypes', 'Classes'],
    filteredClass: ['Diagnosis', 'MapType', 'Concept Class'],
    filteredList: [],
    filteredByClass: [],
    filteredBySource: [],
    sourceList: [],
    classList: [],
  },
};

export const newConcept = {
  type: 'Concept',
  uuid: '8d492ee0-c2cc-11de-8d13-0010c6dffd02',
  id: '12845003',
  external_id: '12845003',

  concept_class: 'Laboratory Procedure',
  retired: false,

  names: [
    {
      type: 'ConceptName',
      uuid: 'akdiejf93jf939f9',
      external_id: '14',
      name: 'Malaria smear',
      locale: 'en',
      locale_preferred: 'true',
      name_type: 'Designated Preferred Name',
    },
    {
      type: 'ConceptName',
      uuid: 'akdiejf93jf939f9',
      external_id: '176',
      name: 'Malaria smear (procedure)',
      locale: 'en',
      name_type: 'Full Form of Descriptor',
    },
  ],

  source: 'SNOMED-CT',
  owner: 'IHTSDO',
  owner_type: 'Organization',

  version: '73jifjibL83',

  url: '/orgs/IHTSDO/sources/SNOMED-CT/concepts/12845003/',
  version_url: '/orgs/IHTSDO/sources/SNOMED-CT/concepts/12845003/73jifjibL83/',
  source_url: '/orgs/IHTSDO/sources/SNOMED-CT/',
  owner_url: '/orgs/IHTSDO/',
  mappings_url: '/orgs/IHTSDO/sources/SNOMED-CT/concepts/12845003/mappings/',

  versions: 1,

  created_on: '2008-01-14T04:33:35Z',
  created_by: 'johndoe',
  updated_on: '2008-01-14T04:33:35Z',
  updated_by: 'johndoe',

  extras: {
    UMLS_CUI: 'C0200703',
    ISPRIMITIVE: '1',
  },
};

export const newConceptData = {
  id: '12845003',
  external_id: '12845003',
  concept_class: 'Laboratory Procedure',
  datatype: 'N/A',
  names: [
    {
      name: 'Malaria smear',
      external_id: '14',
      locale: 'en',
      locale_preferred: 'true',
      name_type: 'Designated Preferred Name',
    },
    {
      name: 'Malaria smear (procedure)',
      external_id: '176',
      locale: 'en',
      name_type: 'Full Form of Descriptor',
    },
  ],

  extras: {
    UMLS_CUI: 'C0200703',
    ISPRIMITIVE: '1',
  },
};
