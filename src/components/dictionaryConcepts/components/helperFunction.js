import { union, includes } from 'lodash';
import urlConfig from '../../../config';

export const getUsername = () => localStorage.getItem('username');

export const classes = [
  'Drug',
  'Diagnosis',
  'Finding',
  'Anatomy',
  'Question',
  'LabSet',
  'MedSet',
  'ConvSet',
  'Misc',
  'Symptom',
  'Symptom/Finding',
  'Specimen',
  'Misc-Order',
  'Workflow',
  'State',
  'Program',
  'Aggregate-Measurement',
  'Indicator',
  'Health-Care-Monitoring-Topics',
  'Radiology-Imaging-Procedure',
  'Frequency',
  'Pharmacologic-Drug-Class',
  'Units-of-Measure',
  'Organism',
  'Drug-form',
  'Medical-supply',
  'InteractSet',
  'Test',
  'Procedure',
];

export const DATA_TYPES = [
  'Boolean',
  'Coded',
  'Complex',
  'Document',
  'Date',
  'Time',
  'Datetime',
  'Structured-Numeric',
  'Rule',
  'Numeric',
  'N/A',
  'Text',
];

export const MAP_TYPES_DEFAULTS = ['SAME-AS', 'NARROWER-THAN'];

export const INTERNAL_MAPPING_DEFAULT_SOURCE = 'CIEL';
export const CIEL_SOURCE_URL = '/orgs/CIEL/sources/CIEL/';

export const MAP_TYPE = {
  conceptSet: 'CONCEPT-SET',
  questionAndAnswer: 'Q-AND-A',
};

export const CONCEPT_TYPE = {
  question: 'Question',
};

export const CONCEPT_CLASS = {
  question: 'Question',
  diagnosis: 'Diagnosis',
};

export const TRADITIONAL_OCL_HOST = urlConfig.TRADITIONAL_OCL_HOST;
export const CANCEL_WARNING = 'You have unsaved changes. Do you wish to leave without saving these changes?';
export const LEAVE_PAGE_POPUP_TITLE = 'Are you sure you want to leave this page?';
export const LEAVE_PAGE = 'Leave';
export const STAY_ON_PAGE = 'Stay';
export const INTERNET_ERROR = 'An error occurred with your internet connection, please fix it and try reloading the page.';
export const CUSTOM_SOURCE = 'Custom';
export const SOURCES = [INTERNAL_MAPPING_DEFAULT_SOURCE];
export const ATTRIBUTE_NAME_SOURCE = 'source';
export const KEY_CODE_FOR_ENTER = 13;
export const KEY_CODE_FOR_ESCAPE = 27;
export const KEY_CODE_FOR_SPACE = 32;
export const MAPPINGS_RECURSION_DEPTH = 10;
export const isSetConcept = conceptClass => conceptClass.toLowerCase().indexOf('set') > -1;
export const removeDuplicates = items => union(items);
export const isExternalSource = source => source && includes(['External', 'externalDictionary'], source.source_type);
export const preventFormSubmit = event => event.target.type !== 'textarea'
    && event.which === KEY_CODE_FOR_ENTER
    && event.preventDefault();
export const compareConceptsByUpdateDate = (firstConcept, nextConcept) => {
  if (firstConcept.updated_on < nextConcept.updated_on) return 1;
  if (firstConcept.updated_on > nextConcept.updated_on) return -1;
  return 0;
};
export const removeBlankMappings = (mappings) => {
  if (!mappings) return [];
  return mappings.filter(
    mapping => mapping.to_concept_url
      || (mapping.sourceObject && mapping.sourceObject.url && mapping.to_concept_code),
  );
};
export const removeBlankSetsOrAnswers = (items) => {
  if (!items) return [];
  return items.filter(
    item => item.url,
  );
};
export const convertToFrontendNameType = (nameType) => {
  switch (nameType) {
    case 'FULLY_SPECIFIED': return 'Fully Specified';
    case 'SHORT': return 'Short';
    case 'INDEX_TERM': return 'Index Term';
    case null: return 'Synonym';
    default: return nameType;
  }
};
export const buildAddConceptToCollectionMessage = (conceptName, results) => {
  const conceptResult = results[0];
  const otherResults = results.slice(1);

  const addedCount = otherResults.filter(result => result.added).length;
  const alreadyInCollectionCount = otherResults.length - addedCount;

  const conceptMessage = conceptResult.added ? `Added ${conceptName}.` : `${conceptName} already in collection.`;
  const addedConceptsMessage = addedCount > 0 ? ` ${addedCount} dependent concepts were added.` : '';
  const alreadyAddedMessage = alreadyInCollectionCount > 0 ? ` ${alreadyInCollectionCount} already added concepts were skipped` : '';

  return conceptMessage + addedConceptsMessage + alreadyAddedMessage;
};
