import { notify } from 'react-notify-toast';

export const getLoggedInUsername = () => localStorage.getItem('username');
export const buildPartialSearchQuery = query => query.replace(new RegExp(' ', 'g'), '* ');
export const checkErrorMessage = (error, message) => {
  if (error && error.response && error.response.data && error.response.data.detail) {
    notify.show(error.response.data.detail, 'error', 3000);
  } else if (error && error.response && error.response.data) {
    notify.show(error.response.data, 'error', 3000);
  } else {
    notify.show(message, 'error', 3000);
  }
};
export const prioritiseItems = (arrayToSort, arrayToOrderBy, keyToSortBy) => {
  arrayToSort.sort((a, b) => {
    const A = a[keyToSortBy];
    const B = b[keyToSortBy];

    if (arrayToOrderBy.indexOf(A) > arrayToOrderBy.indexOf(B)) {
      return -1;
    }
    return 1;
  });

  return arrayToSort;
};

export const sourcePriorityOrder = [
  'CIEL',
  'SNOMED CT',
  'ICD-10-WHO',
  'ICD-10-WHO 2nd',
  'LOINC',
  'RxNORM',
  'IMO ProblemIT',
  'IMO ProcedureIT',
  '3BT',
  'ICPC2',
  'AMPATH',
  'PIH',
  'PIH Malawi',
  'org.openmrs.module.mdrtb',
  'CCAM',
  'HL-7 CVX',
  'NDF-RT NUI',
  'MED-RT NUI',
  'NCI Concept Code',
  'FDA Route of Administration',
  'org.openmrs.module.emrapi',
  'HL7 DiagnosticServiceSections',
  'HL7 2.x Route of Administration',
  'HL7 DiagnosticReportStatus',
  'SNOMED US',
  'Radlex',
];
