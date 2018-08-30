import moxios from 'moxios';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import instance from '../../../config/axiosConfig';
import {
  IS_FETCHING,
  FETCH_DICTIONARY_CONCEPT,
  POPULATE_SIDEBAR,
  FILTER_BY_CLASS,
  FILTER_BY_SOURCES,
  CREATE_NEW_NAMES,
  REMOVE_ONE_NAME,
  ADD_NEW_DESCRIPTION,
  REMOVE_ONE_DESCRIPTION,
  CLEAR_FORM_SELECTIONS,
  CREATE_NEW_CONCEPT,
  ADD_CONCEPT_TO_DICTIONARY,
  TOTAL_CONCEPT_COUNT,
  FETCH_NEXT_CONCEPTS,
  FETCH_EXISTING_CONCEPT,
  EDIT_CONCEPT_ADD_DESCRIPTION,
  EDIT_CONCEPT_REMOVE_ONE_DESCRIPTION,
  CLEAR_PREVIOUS_CONCEPT,
  EDIT_CONCEPT_CREATE_NEW_NAMES,
  EDIT_CONCEPT_REMOVE_ONE_NAME,
  UPDATE_CONCEPT,
  FETCH_EXISTING_CONCEPT_ERROR,
} from '../../../redux/actions/types';
import {
  fetchDictionaryConcepts,
  filterByClass,
  filterBySource,
  createNewName,
  removeNewName,
  addNewDescription,
  removeDescription,
  clearSelections,
  createNewConcept,
  addConceptToDictionary,
  paginateConcepts,
  fetchExistingConcept,
  addDescriptionForEditConcept,
  removeDescriptionForEditConcept,
  clearPreviousConcept,
  createNewNameForEditConcept,
  removeNameForEditConcept,
  updateConcept,
} from '../../../redux/actions/concepts/dictionaryConcepts';
import concepts, {
  mockConceptStore,
  newConcept,
  newConceptData,
  multipleConceptsMockStore,
  existingConcept,
} from '../../__mocks__/concepts';

jest.mock('uuid/v4', () => jest.fn(() => 1));
jest.mock('react-notify-toast');
const mockStore = configureStore([thunk]);

describe('Test suite for dictionary concept actions', () => {
  beforeEach(() => {
    moxios.install(instance);
  });

  afterEach(() => {
    moxios.uninstall(instance);
  });

  it('should handle FETCH_DICTIONARY_CONCEPT', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: [concepts],
      });
    });

    const expectedActions = [
      { type: IS_FETCHING, payload: true },
      { type: FETCH_DICTIONARY_CONCEPT, payload: [concepts] },
      { type: TOTAL_CONCEPT_COUNT, payload: 1 },
      { type: FETCH_NEXT_CONCEPTS, payload: [concepts] },
      { type: IS_FETCHING, payload: false },
      { type: POPULATE_SIDEBAR, payload: [] },
    ];

    const store = mockStore(mockConceptStore);

    return store.dispatch(fetchDictionaryConcepts('orgs', 'CIEL', 'CIEL')).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
  it('should handle error in FETCH_DICTIONARY_CONCEPT', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 400,
        response: 'bad request',
      });
    });

    const expectedActions = [
      { type: IS_FETCHING, payload: true },
      { type: FETCH_DICTIONARY_CONCEPT, payload: 'bad request' },
      { type: IS_FETCHING, payload: false },
    ];

    const store = mockStore(mockConceptStore);

    return store.dispatch(fetchDictionaryConcepts('orgs', 'CIEL', 'CIEL')).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
  it('should handle CREATE_NEW_CONCEPT', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: newConcept,
      });
    });

    const expectedActions = [
      { type: IS_FETCHING, payload: true },
      { type: CREATE_NEW_CONCEPT, payload: newConcept },
    ];

    const store = mockStore(mockConceptStore);
    const url = '/orgs/IHTSDO/sources/SNOMED-CT/concepts/';
    return store.dispatch(createNewConcept(newConceptData, url)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
  it('should handle error in CREATE_NEW_CONCEPT', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 400,
        response: 'bad request',
      });
    });

    const expectedActions = [
      { type: IS_FETCHING, payload: true },
      { type: CREATE_NEW_CONCEPT, payload: 'bad request' },
      { type: IS_FETCHING, payload: false },
    ];

    const store = mockStore(mockConceptStore);
    const url = '/orgs/IHTSDO/sources/SNOMED-CT/concepts/';
    return store.dispatch(createNewConcept(newConceptData, url)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
  it('should handle ADD_CONCEPT_TO_DICTIONARY', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: { added: true },
      });
    });

    const expectedActions = [
      { type: ADD_CONCEPT_TO_DICTIONARY, payload: { added: true } },
      { type: IS_FETCHING, payload: false },
    ];

    const store = mockStore(mockConceptStore);
    const url = '/orgs/IHTSDO/sources/SNOMED-CT/concepts/';
    return store.dispatch(addConceptToDictionary(newConceptData, url)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
  it('should handle error in ADD_CONCEPT_TO_DICTIONARY', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 400,
        response: 'bad request',
      });
    });

    const expectedActions = [];

    const store = mockStore(mockConceptStore);
    const url = '/orgs/IHTSDO/sources/SNOMED-CT/concepts/';
    return store.dispatch(addConceptToDictionary(newConceptData, url)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should handle FETCH_EXISTING_CONCEPT', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: existingConcept,
      });
    });

    const expectedActions = [
      { type: IS_FETCHING, payload: true },
      { type: FETCH_EXISTING_CONCEPT, payload: existingConcept },
    ];

    const store = mockStore(mockConceptStore);
    const conceptUrl = '/orgs/EthiopiaNHDD/sources/HMIS-Indicators/concepts/C1.1.1.1/';
    return store.dispatch(fetchExistingConcept(conceptUrl)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});

describe('Testing Edit concept actions ', () => {
  beforeEach(() => {
    moxios.install(instance);
  });

  afterEach(() => {
    moxios.uninstall(instance);
  });
  it('should handle FETCH_EXISTING_CONCEPT', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: existingConcept,
      });
    });

    const expectedActions = [
      { type: IS_FETCHING, payload: true },
      { type: FETCH_EXISTING_CONCEPT, payload: existingConcept },
    ];

    const store = mockStore(mockConceptStore);
    const conceptUrl = '/orgs/EthiopiaNHDD/sources/HMIS-Indicators/concepts/C1.1.1.1/';
    return store.dispatch(fetchExistingConcept(conceptUrl)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should handle EDIT_CONCEPT_ADD_DESCRIPTION', () => {
    const expectedActions = [
      { type: EDIT_CONCEPT_ADD_DESCRIPTION, payload: 1 },
    ];

    const store = mockStore(mockConceptStore);

    store.dispatch(addDescriptionForEditConcept());
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should handle EDIT_CONCEPT_REMOVE_ONE_DESCRIPTION', () => {
    const expectedActions = [
      { type: EDIT_CONCEPT_REMOVE_ONE_DESCRIPTION, payload: 1 },
    ];

    const store = mockStore(mockConceptStore);

    store.dispatch(removeDescriptionForEditConcept(1));
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should handle CLEAR_PREVIOUS_CONCEPT', () => {
    const expectedActions = [
      { type: CLEAR_PREVIOUS_CONCEPT },
    ];

    const store = mockStore(mockConceptStore);

    store.dispatch(clearPreviousConcept());
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should handle EDIT_CONCEPT_CREATE_NEW_NAMES', () => {
    const expectedActions = [
      { type: EDIT_CONCEPT_CREATE_NEW_NAMES, payload: 1 },
    ];

    const store = mockStore(mockConceptStore);

    store.dispatch(createNewNameForEditConcept());
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should handle EDIT_CONCEPT_REMOVE_ONE_NAME', () => {
    const expectedActions = [
      { type: EDIT_CONCEPT_REMOVE_ONE_NAME, payload: 1 },
    ];

    const store = mockStore(mockConceptStore);

    store.dispatch(removeNameForEditConcept(1));
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should handle UPDATE_CONCEPT', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: existingConcept,
      });
    });

    const history = {
      goBack: () => '',
    };

    const expectedActions = [
      { type: IS_FETCHING, payload: true },
      { type: UPDATE_CONCEPT, payload: existingConcept },
    ];

    const store = mockStore(mockConceptStore);
    const conceptUrl = '/orgs/EthiopiaNHDD/sources/HMIS-Indicators/concepts/C1.1.1.1/';
    return store.dispatch(updateConcept(conceptUrl, existingConcept, history)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should handle error in FETCH_EXISTING_CONCEPT_ERROR for update concept', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 400,
        response: 'bad request',
      });
    });

    const history = {
      goBack: () => '',
    };

    const expectedActions = [
      { type: IS_FETCHING, payload: true },
      { type: FETCH_EXISTING_CONCEPT_ERROR, payload: 'bad request' },
      { type: IS_FETCHING, payload: false },
    ];

    const store = mockStore(mockConceptStore);
    const conceptUrl = '/orgs/EthiopiaNHDD/sources/HMIS-Indicators/concepts/C1.1.1.1/';
    return store.dispatch(updateConcept(conceptUrl, existingConcept, history)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should handle error in FETCH_EXISTING_CONCEPT_ERROR for fetching exing concepts', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 400,
        response: 'bad request',
      });
    });

    const expectedActions = [
      { type: IS_FETCHING, payload: true },
      { type: FETCH_EXISTING_CONCEPT_ERROR, payload: 'bad request' },
      { type: IS_FETCHING, payload: false },
    ];

    const store = mockStore(mockConceptStore);
    const conceptUrl = '/orgs/EthiopiaNHDD/sources/HMIS-Indicators/concepts/C1.1.1.1/';
    return store.dispatch(fetchExistingConcept(conceptUrl)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});


describe('test for search filter by class', () => {
  const store = mockStore(mockConceptStore);
  const expectedActions = [
    { type: FILTER_BY_CLASS, payload: 'MapType' },
    { payload: true, type: '[ui] toggle spinner' },
  ];

  store.dispatch(filterByClass('MapType', 'users', 'emasys', 'dev-col', 'classes', ''));
  expect(store.getActions()).toEqual(expectedActions);
});

describe('test for search filter by source', () => {
  const store = mockStore(mockConceptStore);
  const expectedActions = [
    { type: FILTER_BY_SOURCES, payload: 'MapType' },
    { payload: true, type: '[ui] toggle spinner' },
  ];

  store.dispatch(filterBySource('MapType', 'users', 'emasys', 'dev-col', 'source', ''));
  expect(store.getActions()).toEqual(expectedActions);
});

describe('test suite for synchronous action creators', () => {
  it('should handle CREATE_NEW_NAMES', () => {
    const store = mockStore(mockConceptStore);
    const expectedActions = [{ type: CREATE_NEW_NAMES, payload: 1 }];
    store.dispatch(createNewName());
    expect(store.getActions()).toEqual(expectedActions);
  });
  it('should handle FETCH_NEXT_CONCEPTS', () => {
    const expectedActions = [
      { type: TOTAL_CONCEPT_COUNT, payload: 11 },
      { type: FETCH_NEXT_CONCEPTS, payload: multipleConceptsMockStore.concepts.dictionaryConcepts },
    ];
    const store = mockStore(multipleConceptsMockStore);
    store.dispatch(paginateConcepts(undefined, 11, 0));
    expect(store.getActions()).toEqual(expectedActions);
  });
  it('should handle REMOVE_ONE_NAME', () => {
    const store = mockStore(mockConceptStore);
    const expectedActions = [{ type: REMOVE_ONE_NAME, payload: 1 }];
    store.dispatch(removeNewName(1));
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should handle ADD_NEW_DESCRIPTION', () => {
    const store = mockStore(mockConceptStore);
    const expectedActions = [{ type: ADD_NEW_DESCRIPTION, payload: 1 }];
    store.dispatch(addNewDescription());
    expect(store.getActions()).toEqual(expectedActions);
  });
  it('should handle REMOVE_ONE_DESCRIPTION', () => {
    const store = mockStore(mockConceptStore);
    const expectedActions = [{ type: REMOVE_ONE_DESCRIPTION, payload: 1 }];
    store.dispatch(removeDescription(1));
    expect(store.getActions()).toEqual(expectedActions);
  });
  it('should handle CLEAR_FORM_SELECTIONS', () => {
    const store = mockStore(mockConceptStore);
    const expectedActions = [{ type: CLEAR_FORM_SELECTIONS, payload: [] }];
    store.dispatch(clearSelections());
    expect(store.getActions()).toEqual(expectedActions);
  });
});
