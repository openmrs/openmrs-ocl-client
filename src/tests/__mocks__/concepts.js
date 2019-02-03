import { INTERNAL_MAPPING_DEFAULT_SOURCE } from '../../components/dictionaryConcepts/components/helperFunction';

export default {
  id: '1468667',
  external_id: '146869AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
  concept_class: 'Diagnosis',
  datatype: 'N/A',
  retired: false,
  source: INTERNAL_MAPPING_DEFAULT_SOURCE,
  descriptions: [
    {
      uuid: '453aa9941e824becaad4b374899e8bcb',
      external_id: null,
      description:
        // eslint-disable-next-line max-len
        'The proportion of women of reproductive age (15-49 years) who are not pregnant and are accepting a modern contraceptive method (new and repeat acceptors).  ',
      locale: 'en',
      locale_preferred: true,
      description_type: null,
      type: 'ConceptDescription',
    },
  ],
  owner: INTERNAL_MAPPING_DEFAULT_SOURCE,
  owner_type: 'Organization',
  owner_url: '/orgs/CIEL/',
  display_name: 'Bronze Diabetes',
  display_locale: 'en',
  version: '5835c0e2955c3c0007e5fb79',
  mappings: null,
  is_latest_version: true,
  locale: null,
  version_url:
    '/orgs/CIEL/sources/CIEL/concepts/146869/5835c0e2955c3c0007e5fb79/',
  url: '/orgs/CIEL/sources/CIEL/concepts/146869/',
};

export const conceptWithoutDescriptions = {
  id: '1468667',
  external_id: '146869AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
  concept_class: 'Diagnosis',
  datatype: 'N/A',
  retired: false,
  source: INTERNAL_MAPPING_DEFAULT_SOURCE,
  descriptions: null,
  owner: INTERNAL_MAPPING_DEFAULT_SOURCE,
  owner_type: 'Organization',
  owner_url: '/orgs/CIEL/',
  display_name: 'Bronze Diabetes',
  display_locale: 'en',
  version: '5835c0e2955c3c0007e5fb79',
  mappings: null,
  is_latest_version: true,
  locale: null,
  version_url:
    '/orgs/CIEL/sources/CIEL/concepts/146869/5835c0e2955c3c0007e5fb79/',
  url: '/orgs/CIEL/sources/CIEL/concepts/146869/',
};

export const concept2 = {
  id: '1468667',
  external_id: '146869AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
  concept_class: 'Diagnosis',
  datatype: 'N/A',
  retired: false,
  source: 'CIEL',
  descriptions: [
    {
      uuid: '453aa9941e824becaad4b374899e8bcb',
      external_id: null,
      description:
        // eslint-disable-next-line max-len
        'The proportion of women of reproductive age (15-49 years) who are not pregnant and are accepting a modern contraceptive method (new and repeat acceptors).  ',
      locale: 'en',
      locale_preferred: true,
      description_type: null,
      type: 'ConceptDescription',
    },
  ],
  owner: 'CIEL',
  owner_type: 'Organization',
  owner_url: '/orgs/CIEL/',
  display_name: 'Bronze Diabetes',
  display_locale: 'en',
  version: '5835c0e2955c3c0007e5fb79',
  mappings: null,
  is_latest_version: true,
  locale: null,
  version_url:
    '/orgs/CIEL/sources/CIEL/concepts/146869/5835c0e2955c3c0007e5fb79/',
  url: '/orgs/CIEL/sources/CIEL/concepts/146869/',
};

export const concept3 = {
  ...concept2,
  source: '12345678',
};

const concept = {
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
  updated_on: '2018-03-13T11:27:02.447',
  version_url:
    '/orgs/CIEL/sources/CIEL/concepts/146869/5835c0e2955c3c0007e5fb79/',
  url: '/orgs/CIEL/sources/CIEL/concepts/146869/',
};
export const mockConcepts = (() => {
  const concepts = [];
  let i = 0;
  while (i < 30) {
    const newConcept = { ...concept, id: String(i), version: String(i) };
    concepts.push(newConcept);
    i += 1;
  }
  return concepts;
})();
export const multipleConceptsMockStore = {
  concepts: {
    concepts: [],
    loading: false,
    dictionaryConcepts: mockConcepts,
    filteredSources: ['dev-col', 'MapTypes', 'Classes'],
    filteredClass: ['Diagnosis', 'MapType', 'Concept Class'],
    filteredList: [],
    filteredByClass: [],
    filteredBySource: [],
    sourceList: [],
    classList: [],
  },
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
  bulkConcepts: {
    datatypeList: [],
    classList: [],
    bulkConcepts: [{ id: 123 }],
  },
};

export const paginatedConcepts = {
  concepts: [
    {
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
      version_url:
        '/orgs/IHTSDO/sources/SNOMED-CT/concepts/12845003/73jifjibL83/',
      source_url: '/orgs/IHTSDO/sources/SNOMED-CT/',
      owner_url: '/orgs/IHTSDO/',
      mappings_url:
        '/orgs/IHTSDO/sources/SNOMED-CT/concepts/12845003/mappings/',

      versions: 1,

      created_on: '2008-01-14T04:33:35Z',
      created_by: 'johndoe',
      updated_on: '2008-01-14T04:33:35Z',
      updated_by: 'johndoe',

      extras: {
        UMLS_CUI: 'C0200703',
        ISPRIMITIVE: '1',
      },
    },
    {
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
      version_url:
        '/orgs/IHTSDO/sources/SNOMED-CT/concepts/12845003/73jifjibL83/',
      source_url: '/orgs/IHTSDO/sources/SNOMED-CT/',
      owner_url: '/orgs/IHTSDO/',
      mappings_url:
        '/orgs/IHTSDO/sources/SNOMED-CT/concepts/12845003/mappings/',

      versions: 1,

      created_on: '2008-01-14T04:33:35Z',
      created_by: 'johndoe',
      updated_on: '2008-01-14T04:33:35Z',
      updated_by: 'johndoe',

      extras: {
        UMLS_CUI: 'C0200703',
        ISPRIMITIVE: '1',
      },
    },
  ],
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
  mappings: [
    {
      id: 1,
      map_type: 'Same as',
      source: INTERNAL_MAPPING_DEFAULT_SOURCE,
      to_concept_code: 'dce20834-a9d7-41c6-be70-587f5246d41a',
      to_concept_name: 'MALARIA SMEAR, QUALITATIVE',
      to_source_url: '/orgs/CIEL/sources/CIEL/concepts/1366/',
      isNew: false,
    },
    {
      map_type: 'Narrower than',
      source: INTERNAL_MAPPING_DEFAULT_SOURCE,
      to_concept_code: '67c0bc01-4f16-4424-80fd-f08b122bcef2',
      to_concept_name: 'MALARIA DIAGNOSIS IN THE LAST TWELVE MONTHS',
      to_source_url: '/orgs/CIEL/sources/CIEL/concepts/1476/',
      isNew: true,
    },
    {
      id: 3,
      map_type: 'Same as',
      source: 'SNOMED',
      to_concept_code: '92eebf0a-df73-4c17-985f-0347c7dee768',
      to_concept_name: 'malaria',
      to_source_url: null,
      isNew: false,
    },
  ],
};

export const existingConcept = {
  type: 'Concept',
  uuid: '5824be62fc6b9000075d4981',
  id: 'C1.1.1.1',
  external_id: null,
  concept_class: 'Indicator',
  datatype: 'Numeric',
  display_name: 'Contraceptive acceptance rate',
  display_locale: 'en',
  names: [
    {
      uuid: '42d624cf7f5b462f831a79f43f043f49',
      external_id: null,
      name: 'Contraceptive acceptance rate',
      locale: 'en',
      locale_preferred: true,
      name_type: 'Fully Specified',
      type: 'ConceptName',
    },
  ],
  descriptions: [
    {
      uuid: '453aa9941e824becaad4b374899e8bcb',
      external_id: null,
      description:
        // eslint-disable-next-line max-len
        'The proportion of women of reproductive age (15-49 years) who are not pregnant and are accepting a modern contraceptive method (new and repeat acceptors).  ',
      locale: 'en',
      locale_preferred: true,
      description_type: null,
      type: 'ConceptDescription',
    },
  ],
  retired: false,
  source: 'HMIS-Indicators',
  source_url: '/orgs/EthiopiaNHDD/sources/HMIS-Indicators/',
  owner: 'EthiopiaNHDD',
  owner_type: 'Organization',
  owner_url: '/orgs/EthiopiaNHDD/',
  version: '5824be62fc6b9000075d4981',
  created_on: '2016-11-10T13:37:22.553',
  updated_on: '2017-10-13T07:12:36.218',
  version_created_on: '2016-11-10T13:37:22.553',
  version_created_by: 'root',
  extras: {
    'HMIS-Category-2': 'C1.1 Maternal and Child Health',
    'HMIS-Category-3': 'C.1.1 Maternal Health',
    'HMIS-Category-1': 'C1: Access to Health Service',
    Interpretation:
      // eslint-disable-next-line max-len
      'This indicator is directly related to operations: for contraception utilization (and prevalence) to increase, the numbers of both new and repeat acceptors should increase. Each acceptor is counted only once, the first time s/he receives contraceptive services in the fiscal year.\n“New acceptors” refers to the number of acceptors who receive family planning services from a recognized program for the first time irrespective of the method used. This is not the number of consultations. Each acceptor is enumerated once in the year, at the first consultation for contraception in the calendar year. \n“Repeat acceptors” refers to the number of acceptors who receive family planning services from a family planning program previously irrespective of the method used.  Long acting FP method users will also be counted as repeat every year including routine checkup for ongoing use of a long term method such as Norplant, IUD, etc.\nNew and repeat contraceptive acceptors are reported as two separate counts, so it is possible to calculate each rate separately as needed. Acceptor data reported from NGOs and other community-based non MOH sources can also be included in this calculation.',
    'HMIS-Category-4': '',
    'Applicable Reporting Units':
      'HP, HC/Clinic, Hospital, WorHO, ZHD/ScHO, RHB, FMOH',
    Numerator: 'Number of new and repeat acceptors',
    Denominator:
      'Total number of women of reproductive age (15-49) who are not pregnant',
    Disaggregation:
      // eslint-disable-next-line max-len
      'By acceptors: New, repeat\nAge: 15-19, 20-24, 25-49 years\nBy  Methods: Pills, Injectables, Implants, IUD and Others',
    'Reporting Frequency': 'Monthly',
    Multiplier: '100',
    'Primary Sources':
      // eslint-disable-next-line max-len
      'Family planning register; Service delivery tally (for HP), RH register (for primary private clinics), Pre-ART, ART registers',
  },
  mappings: [
    {
      id: 1,
      map_type: 'Same as',
      source: INTERNAL_MAPPING_DEFAULT_SOURCE,
      to_concept_code: 'dce20834-a9d7-41c6-be70-587f5246d41a',
      to_concept_name: 'MALARIA SMEAR, QUALITATIVE',
      to_source_url: '/orgs/CIEL/sources/CIEL/concepts/1366/',
      isNew: false,
    },
    {
      map_type: 'Narrower than',
      source: INTERNAL_MAPPING_DEFAULT_SOURCE,
      to_concept_code: '67c0bc01-4f16-4424-80fd-f08b122bcef2',
      to_concept_name: 'MALARIA DIAGNOSIS IN THE LAST TWELVE MONTHS',
      to_source_url: '/orgs/CIEL/sources/CIEL/concepts/1476/',
      isNew: true,
    },
    {
      id: 3,
      map_type: 'Same as',
      source: 'SNOMED',
      to_concept_code: '92eebf0a-df73-4c17-985f-0347c7dee768',
      to_concept_name: 'malaria',
      to_source_url: null,
      isNew: false,
    },
  ],
  is_latest_version: true,
  locale: null,
  version_url:
    '/orgs/EthiopiaNHDD/sources/HMIS-Indicators/concepts/C1.1.1.1/5824be62fc6b9000075d4981/',
  url: '/orgs/EthiopiaNHDD/sources/HMIS-Indicators/concepts/C1.1.1.1/',
};

export const nullConceptDescription = {
  type: 'Concept',
  uuid: '5821828444273a000717d00b',
  id: 'None',
  external_id: null,
  concept_class: 'NameType',
  datatype: 'N/A',
  display_name: 'None',
  display_locale: 'en',
  names: null,
  descriptions: null,
  retired: false,
  source: 'NameTypes',
  source_url: '/orgs/OCL/sources/NameTypes/',
  owner: 'OCL',
  owner_type: 'Organization',
  owner_url: '/orgs/OCL/',
  version: '5821828444273a000717d00b',
  created_on: '2016-11-08T02:45:08.857',
  updated_on: '2017-10-13T07:11:51.995',
  version_created_on: '2016-11-08T02:45:08.857',
  version_created_by: 'root',
  extras: null,
  mappings: null,
  is_latest_version: true,
  locale: null,
  version_url:
    '/orgs/OCL/sources/NameTypes/concepts/None/5821828444273a000717d00b/',
  url: '/orgs/OCL/sources/NameTypes/concepts/None/',
};
