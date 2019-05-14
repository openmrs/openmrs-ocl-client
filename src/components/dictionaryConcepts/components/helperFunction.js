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
  'Symptom-Finding',
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
};

export const TRADITIONAL_OCL_HOST = urlConfig.TRADITIONAL_OCL_HOST;
export const CANCEL_WARNING = 'You have unsaved changes. Do you wish to leave without saving these changes?';
export const LEAVE_PAGE_POPUP_TITLE = 'Are you sure you want to leave this page?';
export const LEAVE_PAGE = 'Leave';
export const STAY_ON_PAGE = 'Stay';
export const INTERNET_ERROR = 'An error occurred with your internet connection, please fix it and try reloading the page.';
export const CUSTOM_SOURCE = 'Custom';
export const ATTRIBUTE_NAME_SOURCE = 'source';
export const KEY_CODE_FOR_ENTER = 13;
export const KEY_CODE_FOR_ESCAPE = 27;
export const KEY_CODE_FOR_SPACE = 32;
