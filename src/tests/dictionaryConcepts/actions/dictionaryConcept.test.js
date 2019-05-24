import moxios from 'moxios';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { notify } from 'react-notify-toast';
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
  REMOVE_CONCEPT,
  REMOVE_MAPPING,
  ADD_SELECTED_ANSWERS,
  PRE_POPULATE_ANSWERS,
  ADD_NEW_ANSWER_ROW,
  REMOVE_SELECTED_ANSWER,
  UNPOPULATE_PRE_POPULATED_ANSWERS,
  UN_POPULATE_THIS_ANSWER,
  ADD_NEW_SET_ROW,
  REMOVE_SELECTED_SET,
  ADD_SELECTED_SETS,
  PRE_POPULATE_SETS,
  UNPOPULATE_PRE_POPULATED_SETS,
  UNPOPULATE_SET,
} from '../../../redux/actions/types';
import {
  fetchDictionaryConcepts,
  fetchConceptsByName,
  filterByClass,
  filterBySource,
  createNewName,
  removeNewName,
  addNewDescription,
  removeDescription,
  clearSelections,
  createNewConcept,
  fetchSourceConcepts,
  queryAnswers,
  addConceptToDictionary,
  paginateConcepts,
  fetchExistingConcept,
  addDescriptionForEditConcept,
  removeDescriptionForEditConcept,
  clearPreviousConcept,
  createNewNameForEditConcept,
  removeNameForEditConcept,
  updateConcept,
  addSelectedAnswersToState,
  addAnswerMappingToConcept,
  addNewAnswerRow,
  removeSelectedAnswer,
  unpopulatePrepopulatedAnswers,
  prepopulateAnswers,
  unretireMapping,
  unPopulateThisAnswer,
  addNewSetRow,
  removeSelectedSet,
  addSelectedSetsToState,
  addSetMappingToConcept,
  prePopulateSets,
  unpopulatePrepopulatedSets,
  unpopulateSet,
  buildNewMappingData,
} from '../../../redux/actions/concepts/dictionaryConcepts';
import {
  removeDictionaryConcept,
  removeConceptMapping,
  removeEditedConceptMapping,
} from '../../../redux/actions/dictionaries/dictionaryActionCreators';
import { removeMapping } from '../../../redux/actions/dictionaries/dictionaryActions';
import concepts, {
  mockConceptStore,
  newConcept,
  newConceptData,
  multipleConceptsMockStore,
  newConceptDataWithAnswerAndSetMappings,
  existingConcept, sampleConcept, conceptWithoutMappings,
} from '../../__mocks__/concepts';
import {
  CIEL_SOURCE_URL,
  INTERNAL_MAPPING_DEFAULT_SOURCE,
  MAP_TYPE,
  MAP_TYPES_DEFAULTS
} from '../../../components/dictionaryConcepts/components/helperFunction';

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

  it('should call the fetchSourceConcepts and fetch concepts', async () => {
    const expectedPosts = ['malaria', 'tuberclosis'];

    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({ status: 200, response: expectedPosts });
    });
    await fetchSourceConcepts('source', 'query');
  });

  it('should query possible answer concepts', async () => {
    const expectedAnswers = [{
      id: 'Answer 1',
      url: 'url',
      source: 'source',
      display_name: 'display_name',
    }];

    const expectedResult = [{
      id: 'Answer 1',
      url: 'url',
      source: 'source',
      display_name: 'display_name',
      map_type: MAP_TYPE.questionAndAnswer,
      value: 'url',
      label: 'source: display_name',
    }];

    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({ status: 200, response: expectedAnswers });
    });
    const result = await queryAnswers('source', 'query');
    expect(result).toEqual(expectedResult);
  });

  it('should query possible answer concepts from CIEL', async () => {
    const expectedAnswers = [{
      id: 'CIEL 1',
      url: 'url',
      source: 'source',
      display_name: 'display_name',
    }];

    const expectedResult = [{
      id: 'CIEL 1',
      url: 'url',
      source: 'source',
      display_name: 'display_name',
      map_type: MAP_TYPE.questionAndAnswer,
      value: 'url',
      label: 'source: display_name',
    }];

    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({ status: 200, response: expectedAnswers });
    });
    const result = await queryAnswers(INTERNAL_MAPPING_DEFAULT_SOURCE, 'query');
    expect(result).toEqual(expectedResult);
  });

  it('should handle FETCH_DICTIONARY_CONCEPT', () => {
    const expectedConcepts = [concepts, sampleConcept];
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: expectedConcepts,
      });
    });

    const expectedActions = [
      { type: IS_FETCHING, payload: true },
      { type: FETCH_DICTIONARY_CONCEPT, payload: expectedConcepts },
      { type: TOTAL_CONCEPT_COUNT, payload: 2 },
      { type: FETCH_NEXT_CONCEPTS, payload: expectedConcepts },
      { type: POPULATE_SIDEBAR, payload: [] },
      { type: IS_FETCHING, payload: false },
    ];

    const store = mockStore(mockConceptStore);

    return store.dispatch(fetchDictionaryConcepts('orgs', 'CIEL', 'CIEL')).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should handle FETCH_DICTIONARY_CONCEPT_WITH_SOURCE_FILTERS', () => {
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
    ];

    mockConceptStore.concepts.filteredBySource = ['CIEL'];
    const store = mockStore(mockConceptStore);

    return store.dispatch(fetchDictionaryConcepts('orgs', 'CIEL', 'CIEL')).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should handle FETCH_DICTIONARY_CONCEPT_WITH_CLASS_FILTERS', () => {
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
    ];

    mockConceptStore.concepts.filteredBySource = [];
    mockConceptStore.concepts.filteredByClass = ['procedure'];
    const store = mockStore(mockConceptStore);

    return store.dispatch(fetchDictionaryConcepts('orgs', 'CIEL', 'CIEL')).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should handle FETCH_DICTIONARY_CONCEPT_WITH_CLASS_AND_SOURCE_FILTERS', () => {
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
    ];

    mockConceptStore.concepts.filteredBySource = ['CIEL'];
    mockConceptStore.concepts.filteredByClass = ['procedure'];
    const store = mockStore({ ...mockConceptStore, filteredByClass: ['procedure'] });

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

  it('should fetch dictionary concepts by name', () => {
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
      { type: IS_FETCHING, payload: false },
    ];

    const store = mockStore(mockConceptStore);

    return store.dispatch(fetchConceptsByName('search')).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should handle the error when search by name fails', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 404,
      });
    });

    const expectedActions = [
      { type: IS_FETCHING, payload: true },
      { type: IS_FETCHING, payload: false },
    ];

    const store = mockStore(mockConceptStore);

    return store.dispatch(fetchConceptsByName('search')).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });


  it('should handle CREATE_NEW_CONCEPT with answer and set mappings', (done) => {
    const store = mockStore(mockConceptStore);
    const url = '/orgs/IHTSDO/sources/SNOMED-CT/concepts/';

    moxios.stubRequest(/(.*?)/, {
      status: 201,
      response: newConcept,
    });

    const expectedActions = [
      { type: IS_FETCHING, payload: true },
      { type: CREATE_NEW_CONCEPT, payload: newConcept },
    ];

    store.dispatch(createNewConcept(newConceptDataWithAnswerAndSetMappings, url)).then(() => {
      const actions = store.getActions();
      expect(actions.slice(0, 2)).toEqual(expectedActions);
      expect(actions[actions.length - 1]).toEqual({ type: IS_FETCHING, payload: false });
      done();
    });
  });

  it('should handle CREATE_NEW_CONCEPT', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 201,
        response: newConcept,
      });
    });

    const expectedActions = [
      { type: IS_FETCHING, payload: true },
      { type: CREATE_NEW_CONCEPT, payload: newConcept },
      { type: IS_FETCHING, payload: false },
    ];

    const store = mockStore(mockConceptStore);
    const url = '/orgs/IHTSDO/sources/SNOMED-CT/concepts/';
    return store.dispatch(createNewConcept(newConceptData, url)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should handle REMOVE_CONCEPT', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: '/users/admin/sources/858738987555379984/mappings/5bff9fb3bdfb8801a1702975/',
      });
    });

    const expectedActions = [
      { type: REMOVE_CONCEPT, payload: newConcept.version_url },
    ];

    const store = mockStore(mockConceptStore);
    const data = { references: ['/orgs/IHTSDO/sources/SNOMED-CT/concepts/12845003/73jifjibL83/'] };
    const type = 'users';
    const owner = 'alexmochu';
    const collectionId = 'Tech';
    return store.dispatch(removeDictionaryConcept(data, type, owner, collectionId)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should handle REMOVE_MAPPINGS', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 201,
        response: [],
      });
    });

    const expectedActions = [
      {
        type: REMOVE_MAPPING,
        payload: '/users/admin/sources/858738987555379984/mappings/5bff9fb3bdfb8801a1702975/',
      },
      {
        payload: true,
        type: '[ui] toggle spinner',
      },
    ];

    const store = mockStore(mockConceptStore);
    const data = { references: ['/users/admin/sources/858738987555379984/mappings/5bff9fb3bdfb8801a1702975/'] };
    const type = 'users';
    const owner = 'alexmochu';
    return store.dispatch(removeConceptMapping(data, type, owner)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should handle REMOVE_MAPPING network error', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.reject({
        status: 599,
        response: {
          data: { detail: 'Cannot remove mapping' },
        },
      });
    });

    const expectedActions = [
      { type: REMOVE_MAPPING, payload: '/users/admin/sources/858738987555379984/mappings/5bff9fb3bdfb8801a1702975/' },
    ];

    const store = mockStore(mockConceptStore);
    const data = { references: ['/users/admin/sources/858738987555379984/mappings/5bff9fb3bdfb8801a1702975/'] };
    const type = 'users';
    const owner = 'alexmochu';
    const collectionId = 'Tech';
    return store.dispatch(removeConceptMapping(data, type, owner, collectionId)).catch(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should handle REMOVE_CONCEPT network error', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.reject({
        status: 599,
        response: newConcept.version_url,
      });
    });

    const expectedActions = [
      { type: REMOVE_CONCEPT, payload: newConcept.version_url },
    ];

    const store = mockStore(mockConceptStore);
    const data = { references: ['/orgs/IHTSDO/sources/SNOMED-CT/concepts/12845003/73jifjibL83/'] };
    const type = 'users';
    const owner = 'alexmochu';
    const collectionId = 'Tech';
    return store.dispatch(removeDictionaryConcept(data, type, owner, collectionId)).catch(() => {
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

  it('should handle any unknown error in createNewConcept', () => {
    const notifyMock = jest.fn();
    notify.show = notifyMock;

    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.reject({});
    });

    const expectedActions = [
      { type: IS_FETCHING, payload: true },
      { type: IS_FETCHING, payload: false },
    ];

    const store = mockStore(mockConceptStore);
    const url = '/orgs/IHTSDO/sources/SNOMED-CT/concepts/';
    return store.dispatch(createNewConcept(newConceptData, url)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
      expect(notifyMock).toHaveBeenCalledWith('An error occurred when creating a concept. Please retry.', 'error', 2000);
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

    const expectedActions = [{ type: IS_FETCHING, payload: false }];

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
      { type: PRE_POPULATE_ANSWERS, payload: [] },
      { type: PRE_POPULATE_SETS, payload: [] },
      { type: IS_FETCHING, payload: false },
    ];

    const store = mockStore(mockConceptStore);
    const conceptUrl = '/orgs/EthiopiaNHDD/sources/HMIS-Indicators/concepts/C1.1.1.1/';
    return store.dispatch(fetchExistingConcept(conceptUrl)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should dispatch the right actions when mappings are empty', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: conceptWithoutMappings,
      });
    });

    const expectedActions = [
      { type: IS_FETCHING, payload: true },
      { type: FETCH_EXISTING_CONCEPT, payload: conceptWithoutMappings },
      { type: PRE_POPULATE_ANSWERS, payload: [] },
      { type: PRE_POPULATE_SETS, payload: [] },
      { type: IS_FETCHING, payload: false },
    ];

    const store = mockStore(mockConceptStore);
    const conceptUrl = '/orgs/EthiopiaNHDD/sources/HMIS-Indicators/concepts/C1.1.1.1/';
    return store.dispatch(fetchExistingConcept(conceptUrl)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should handle errors if fetching Source Concepts fails', async () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({ status: 200, response: '' });
    });
    const expectedResult = [];
    expect(await fetchSourceConcepts('expect', 'to', 'fail')).toEqual(expectedResult);
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
      { type: PRE_POPULATE_ANSWERS, payload: [] },
      { type: PRE_POPULATE_SETS, payload: [] },
      { type: IS_FETCHING, payload: false },
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
      { type: IS_FETCHING, payload: false },
    ];

    const store = mockStore(mockConceptStore);
    const conceptUrl = '/orgs/EthiopiaNHDD/sources/HMIS-Indicators/concepts/C1.1.1.1/';
    return store.dispatch(updateConcept(conceptUrl, existingConcept, history, 'HMIS-Indicators', existingConcept)).then(() => {
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
    return store.dispatch(updateConcept(conceptUrl, existingConcept, history, 'HMIS-Indicators', existingConcept)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should handle any unknown error in updateConcept', () => {
    const notifyMock = jest.fn();
    notify.show = notifyMock;

    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.reject({});
    });

    const history = {
      goBack: () => '',
    };

    const expectedActions = [
      { type: IS_FETCHING, payload: true },
      { type: IS_FETCHING, payload: false },
    ];

    const store = mockStore(mockConceptStore);
    const conceptUrl = '/orgs/EthiopiaNHDD/sources/HMIS-Indicators/concepts/C1.1.1.1/';
    return store.dispatch(updateConcept(conceptUrl, existingConcept, history, 'HMIS-Indicators', existingConcept)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
      expect(notifyMock).toHaveBeenCalledWith('An error occurred when updating the concept. Please retry.', 'error', 2000);
    });
  });

  it('should unretire a Mapping when the unretireMapping action is triggered', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({ status: 200, response: existingConcept });
    });
    const expectedActions = [
      { type: IS_FETCHING, payload: true },
      { type: UPDATE_CONCEPT, payload: existingConcept },
    ];
    const store = mockStore(mockConceptStore);
    const conceptUrl = '/orgs/EthiopiaNHDD/sources/HMIS-Indicators/concepts/C1.1.1.1/';
    return store.dispatch(unretireMapping(conceptUrl)).then((result) => {
      expect(store.getActions()).toEqual(expectedActions);
      expect(result.retired).toEqual(false);
    });
  });

  it('should handle exceptions for unretire a Mapping', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({ status: 400 });
    });
    const expectedActions = [
      { type: IS_FETCHING, payload: true },
      { type: IS_FETCHING, payload: false },
    ];
    const store = mockStore(mockConceptStore);
    const conceptUrl = '/orgs/EthiopiaNHDD/sources/HMIS-Indicators/concepts/C1.1.1.1/';
    return store.dispatch(unretireMapping(conceptUrl)).then((result) => {
      expect(store.getActions()).toEqual(expectedActions);
      expect(result).toEqual(null);
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

  it('should handle unpopulating a selected answer', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 201,
        response: [],
      });
    });

    const data = { references: ['/users/admin/sources/858738987555379984/mappings/5bff9fb3bdfb8801a1702975/'] };

    const expectedActions = [
      removeMapping(data.references[0]),
    ];

    const store = mockStore(mockConceptStore);
    return store.dispatch(removeEditedConceptMapping(data)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should handle failed request to unpopulate a selected answer', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 500,
        response: [],
      });
    });

    const showNetworkError = jest.fn();
    const data = { references: ['/users/admin/sources/858738987555379984/mappings/5bff9fb3bdfb8801a1702975/'] };

    const store = mockStore(mockConceptStore);
    return store.dispatch(removeEditedConceptMapping(data)).then().catch((error) => {
      expect(error).toBeTruthy();
      expect(showNetworkError).toHaveBeenCalled();
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
  beforeEach(() => {
    moxios.install(instance);
  });

  afterEach(() => {
    moxios.uninstall(instance);
  });

  it('should handle CREATE_NEW_NAMES', () => {
    const store = mockStore(mockConceptStore);
    const expectedActions = [{ type: CREATE_NEW_NAMES, payload: 1 }];
    store.dispatch(createNewName());
    expect(store.getActions()).toEqual(expectedActions);
  });
  it('should handle FETCH_NEXT_CONCEPTS', () => {
    const expectedActions = [
      { type: TOTAL_CONCEPT_COUNT, payload: 30 },
      { type: FETCH_NEXT_CONCEPTS, payload: multipleConceptsMockStore.concepts.dictionaryConcepts },
    ];
    const store = mockStore(multipleConceptsMockStore);
    store.dispatch(paginateConcepts(undefined, 30, 0));
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

  it('should handle ADD_SELECTED_ANSWERS', () => {
    const expectedActions = [
      { type: ADD_SELECTED_ANSWERS, payload: { answer: [{}], uniqueKey: undefined } },
    ];
    const store = mockStore(mockConceptStore);
    store.dispatch(addSelectedAnswersToState([{}]));
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should handle ADD_NEW_ANSWER_ROW', () => {
    const store = mockStore(mockConceptStore);
    const expectedActions = [{ type: ADD_NEW_ANSWER_ROW, payload: {} }];
    store.dispatch(addNewAnswerRow({}));
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should handle REMOVE_SELECTED_ANSWER', () => {
    const store = mockStore(mockConceptStore);
    const expectedActions = [{ type: REMOVE_SELECTED_ANSWER, payload: 'uniqueKey' }];
    store.dispatch(removeSelectedAnswer('uniqueKey'));
    expect(store.getActions()).toEqual(expectedActions);
  });

  describe('addNewSetRow', () => {
    it('dispatches ADD_NEW_SET_ROW action', () => {
      const store = mockStore(mockConceptStore);
      const setRow = {};
      const expectedActions = [{ type: ADD_NEW_SET_ROW, payload: setRow }];
      expect(store.getActions()).not.toEqual(expectedActions);
      store.dispatch(addNewSetRow(setRow));
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  describe('addSelectedSetsToState', () => {
    it('dispatches ADD_SELECTED_SETS action', () => {
      const sets = [{}];
      const expectedActions = [
        { type: ADD_SELECTED_SETS, payload: { set: sets, uniqueKey: undefined } },
      ];
      const store = mockStore(mockConceptStore);
      expect(store.getActions()).not.toEqual(expectedActions);
      store.dispatch(addSelectedSetsToState(sets));
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  describe('removeSelectedSet', () => {
    it('dispatches REMOVE_SELECTED_SET', () => {
      const store = mockStore(mockConceptStore);
      const key = 'uniqueKey';
      const expectedActions = [{ type: REMOVE_SELECTED_SET, payload: key }];
      expect(store.getActions()).not.toEqual(expectedActions);
      store.dispatch(removeSelectedSet(key));
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should handle UNPOPULATE_PRE_POPULATED_ANSWERS', () => {
    const store = mockStore(mockConceptStore);
    const expectedActions = [{ type: UNPOPULATE_PRE_POPULATED_ANSWERS }];
    store.dispatch(unpopulatePrepopulatedAnswers());
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should handle UNPOPULATE_PRE_POPULATED_SETS', () => {
    const store = mockStore(mockConceptStore);
    const expectedActions = [{ type: UNPOPULATE_PRE_POPULATED_SETS }];
    expect(store.getActions()).not.toEqual(expectedActions);
    store.dispatch(unpopulatePrepopulatedSets());
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should handle PRE_POPULATE_ANSWERS', () => {
    const store = mockStore(mockConceptStore);
    const expectedActions = [{
      type: PRE_POPULATE_ANSWERS,
      payload: [{ retired: false, prePopulated: true }],
    }];
    store.dispatch(prepopulateAnswers([{ retired: false, prePopulated: true }]));
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should dispatch UN_POPULATE_THIS_ANSWER action type', () => {
    const store = mockStore(mockConceptStore);
    const answer = {
      frontEndUniqueKey: 'unique',
      prePopulated: true,
    };
    const newAnswer = {
      frontEndUniqueKey: 'unique',
      prePopulated: false,
    };
    const expectedActions = [{
      type: UN_POPULATE_THIS_ANSWER,
      payload: newAnswer,
    }];
    store.dispatch(unPopulateThisAnswer(answer));
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should dispatch UNPOPULATE_SET action type', () => {
    const store = mockStore(mockConceptStore);
    const set = {
      frontEndUniqueKey: 'unique',
      prePopulated: true,
    };
    const newSet = {
      frontEndUniqueKey: 'unique',
      prePopulated: false,
    };
    const expectedActions = [{
      type: UNPOPULATE_SET,
      payload: newSet,
    }];
    store.dispatch(unpopulateSet(set));
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should handle PRE_POPULATE_SETS', () => {
    const store = mockStore(mockConceptStore);
    const expectedActions = [{
      type: PRE_POPULATE_SETS,
      payload: [{ retired: false, prePopulated: true }],
    }];
    store.dispatch(prePopulateSets([{ retired: false, prePopulated: true }]));
    expect(store.getActions()).toEqual(expectedActions);
  });
});

describe('Add answer mappings to concept', () => {
  beforeEach(() => {
    moxios.install(instance);
  });

  afterEach(() => {
    moxios.uninstall(instance);
  });

  it('should add all chosen answer mappings', () => {
    const mappingData = [
      {
        url: 'some/test.url',
        map_scope: 'Internal',
        map_type: 'Same as',
        to_concept_code: '429b6715-774d-4d64-b043-ae5e177df57f',
        to_concept_name: 'CIEL: MALARIAL SMEAR',
        to_concept_source: '/orgs/CIEL/sources/CIEL/concepts/32/',
      },
      {
        url: 'some/test.url',
        map_scope: 'EXternal',
        map_type: 'Narrower than',
        to_concept_code: '429b6715-774d-4d64-b043-ae5e177df57f',
        to_concept_name: 'CIEL: MALARIAL SMEAR',
        to_concept_source: '/orgs/CIEL/sources/CIEL/concepts/32/',
      },
    ];

    const expected = [{
      data: {
        created_at: '2018-12-17T13:32:26.644',
        created_by: 'admin',
        external_id: null,
        extras: null,
        from_concept_code: 'd06c3088-29e4-495a-9a67-62f41e2ab28f',
        from_concept_name: 'jfjf',
        from_concept_url: '/url/test/',
        from_source_name: '2197623860455254',
        from_source_owner: 'admin',
        from_source_owner_type: 'User',
        from_source_url: null,
        id: '5c17ebba389b5a0050817d89',
        map_type: 'Same as',
        owner: 'admin',
        owner_type: 'User',
        retired: false,
        source: '2197623860455254',
        to_concept_code: '1366',
        to_concept_name: 'MALARIA SMEAR, QUALITATIVE',
        to_concept_url: '/orgs/CIEL/sources/CIEL/concepts/1366/',
        to_source_name: 'CIEL',
        to_source_owner: 'CIEL',
        to_source_owner_type: 'Organization',
        to_source_url: CIEL_SOURCE_URL,
        type: 'Mapping',
        updated_at: '2018-12-17T13:32:26.769',
        updated_by: 'admin',
        url: '/users/admin/sources/2197623',
      },
    },
    {
      data: {
        created_at: '2018-12-17T13:32:26.644',
        created_by: 'admin',
        external_id: null,
        extras: null,
        from_concept_code: 'd06c3088-29e4-495a-9a67-62f41e2ab28f',
        from_concept_name: 'jfjf',
        from_concept_url: '/url/test/',
        from_source_name: '2197623860455254',
        from_source_owner: 'admin',
        from_source_owner_type: 'User',
        from_source_url: null,
        id: '5c17ebba389b5a0050817d89',
        map_type: 'Narrower than',
        owner: 'admin',
        owner_type: 'User',
        retired: false,
        source: '2197623860455254',
        to_concept_code: '1366',
        to_concept_name: 'MALARIA SMEAR, QUALITATIVE',
        to_concept_url: '/orgs/CIEL/sources/CIEL/concepts/1366/',
        to_source_name: 'CIEL',
        to_source_owner: 'CIEL',
        to_source_owner_type: 'Organization',
        to_source_url: CIEL_SOURCE_URL,
        type: 'Mapping',
        updated_at: '2018-12-17T13:32:26.769',
        updated_by: 'admin',
        url: '/users/admin/sources/2197623',
      },
    },
    ];

    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({ status: 201, response: expected });
    });
    addAnswerMappingToConcept('/url/test/', '2434435454545', mappingData);
  });
});

describe('Add set mappings to concept', () => {
  beforeEach(() => {
    moxios.install(instance);
  });

  afterEach(() => {
    moxios.uninstall(instance);
  });

  it('should add all chosen set mappings', (done) => {
    const mappingData = [
      {
        url: 'some/test.url',
        map_scope: 'Internal',
        map_type: 'Set',
        to_concept_code: '429b6715-774d-4d64-b043-ae5e177df57f',
        to_concept_name: 'CIEL: MALARIAL SMEAR',
        to_concept_source: '/orgs/CIEL/sources/CIEL/concepts/32/',
      },
    ];

    const url = '/url/test/';
    const source = '2434435454545';
    const mappingUrl = `/users/null/sources/${source}/mappings/`;

    moxios.wait(() => {
      const request = moxios.requests.mostRecent();

      expect(request.config.data).toEqual(JSON.stringify({
        map_type: mappingData[0].map_type,
        from_concept_url: url,
        to_concept_url: mappingData[0].url,
      }));
      expect(request.url.indexOf(mappingUrl)).toBeGreaterThan(-1);

      request.respondWith({ status: 201, response: {} }).then(() => {
        done();
      });
    });

    addSetMappingToConcept(url, source, mappingData);
  });

  it('should notify the user if error occurs when adding set mappings', (done) => {
    const mappingData = [
      {
        url: 'some/test.url',
        map_scope: 'Internal',
        map_type: 'Set',
        to_concept_code: '429b6715-774d-4d64-b043-ae5e177df57f',
        to_concept_name: 'CIEL: MALARIAL SMEAR',
        to_concept_source: '/orgs/CIEL/sources/CIEL/concepts/32/',
      },
    ];

    const notifyShowMock = jest.fn();
    notify.show = notifyShowMock;
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.reject({ status: 400, response: {} });
    });

    addSetMappingToConcept('/url/test/', 'source', mappingData).then(() => {
      expect(notifyShowMock).toHaveBeenCalledWith(
        'A network error occurred while adding your set mappings. Please retry.',
        'error',
        3000,
      );
      done();
    });
  });
});

describe('buildNewMappingData', () => {
  const fromConceptUrl = '/test/from/concept/url';
  const toSourceUrl = '/test/to/source/url';
  const toConceptCode = 'testCode';
  const toConceptName = 'testName';
  const mapType = MAP_TYPES_DEFAULTS[0];

  it('buildNewMappingData should return the map_type, from_concept_url, to_source_url, to_concept_code, to_concept_name if given an external concept', () => {
    const mapping = {
      source: INTERNAL_MAPPING_DEFAULT_SOURCE,
      map_type: mapType,
      to_source_url: toSourceUrl,
      to_concept_code: toConceptCode,
      to_concept_name: toConceptName,
    };
    const expectedMapping = {
      map_type: mapType,
      from_concept_url: fromConceptUrl,
      to_source_url: toSourceUrl,
      to_concept_code: toConceptCode,
      to_concept_name: toConceptName,
    };
    expect(buildNewMappingData(mapping, fromConceptUrl)).toEqual(expectedMapping);
  });

  it('buildNewMappingData should return the map_type, from_concept_url, to_concept_url, to_concept_name if given an internal concept', () => {
    const mapping = {
      source: 'not external',
      map_type: mapType,
      to_concept_code: toConceptCode,
      to_concept_name: toConceptName,
    };
    const expectedMapping = {
      map_type: mapType,
      from_concept_url: fromConceptUrl,
      to_concept_url: `${mapping.source}concepts/${toConceptCode}/`,
      to_concept_name: toConceptName,
    };
    expect(buildNewMappingData(mapping, fromConceptUrl)).toEqual(expectedMapping);
  });
});

describe('buildUpdateMappingData', () => {
  const toSourceUrl = '/test/to/source/url';
  const toConceptCode = 'testCode';
  const toConceptName = 'testName';
  const mapType = MAP_TYPES_DEFAULTS[0];

  it('buildUpdateMappingData should return the map_type, to_source_url, to_concept_code, to_concept_name if given an external concept', () => {
    const mapping = {
      source: INTERNAL_MAPPING_DEFAULT_SOURCE,
      map_type: mapType,
      to_source_url: toSourceUrl,
      to_concept_code: toConceptCode,
      to_concept_name: toConceptName,
    };
    const expectedMapping = {
      map_type: mapType,
      to_source_url: toSourceUrl,
      to_concept_code: toConceptCode,
      to_concept_name: toConceptName,
    };
    expect(buildNewMappingData(mapping)).toEqual(expectedMapping);
  });

  it('buildUpdateMappingData should return the map_type, to_concept_url, to_concept_name if given an internal concept', () => {
    const mapping = {
      source: 'not external',
      map_type: mapType,
      to_concept_code: toConceptCode,
      to_concept_name: toConceptName,
    };
    const expectedMapping = {
      map_type: mapType,
      to_concept_url: `${mapping.source}concepts/${toConceptCode}/`,
      to_concept_name: toConceptName,
    };
    expect(buildNewMappingData(mapping)).toEqual(expectedMapping);
  });
});
