import moxios from 'moxios';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import instance from '../../../config/axiosConfig';
import {
  ADDING_DICTIONARY,
  FETCHING_DICTIONARIES,
  IS_FETCHING,
  CLEAR_DICTIONARIES,
  FETCHING_DICTIONARY,
  CLEAR_DICTIONARY,
  EDIT_DICTIONARY_SUCCESS,
  FETCHING_VERSIONS,
  FETCH_DICTIONARY_CONCEPT,
  FETCHING_ORGANIZATIONS,
  RELEASING_HEAD_VERSION,
  REMOVE_CONCEPT,
} from '../../../redux/actions/types';
import {
  fetchOrganizations,
  addDictionary,
  clearDictionaries,
  isErrored,
  isSuccess,
  clearDictionary,
  removeConcept,
} from '../../../redux/actions/dictionaries/dictionaryActions';
import {
  fetchDictionaries,
  searchDictionaries,
  fetchDictionary,
  fetchVersions,
  fetchDictionaryConcepts,
  releaseHead,
  editDictionary,
} from '../../../redux/actions/dictionaries/dictionaryActionCreators';
import dictionaries from '../../__mocks__/dictionaries';
import versions, { HeadVersion } from '../../__mocks__/versions';
import concepts from '../../__mocks__/concepts';

jest.mock('react-notify-toast');

const mockStore = configureStore([thunk]);

describe('Test for successful organizations fetch', () => {
  const response = {
    data: {},
  };
  const responseData = {
    type: FETCHING_ORGANIZATIONS,
    payload: { data: {} },
  };
  const createDictionary = {
    type: ADDING_DICTIONARY,
    payload: {},
  };

  it('should return action type and payload', () => {
    expect(fetchOrganizations(response)).toEqual(responseData);
  });
  it('should return action type and payload after dictionary creation', () => {
    expect(addDictionary(response)).toEqual(createDictionary);
  });
});

describe('Test for successfully removing a Concept from a dictionary', () => {
  const response = '/url';

  const removeDictionaryConcept = {
    type: REMOVE_CONCEPT,
    payload: response,
  };

  it('should return action type and payload after removing a concept', () => {
    expect(removeConcept(response)).toEqual(removeDictionaryConcept);
  });
});

describe('Test suite for dictionary actions', () => {
  beforeEach(() => {
    moxios.install(instance);
  });
  const responseDict = {
    type: CLEAR_DICTIONARY,
    payload: {},
  };

  it('should return an array of dictionaries', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: [dictionaries],
      });
    });

    const expectedActions = [
      { type: IS_FETCHING, payload: true },
      { type: FETCHING_DICTIONARIES, payload: [dictionaries] },
      { type: IS_FETCHING, payload: false },
    ];

    const store = mockStore({ payload: {} });

    return store.dispatch(fetchDictionaries('', 1000, 1, 'sortAsc=name', 'verbose=true')).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
  it('should return an error message from the db', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 400,
        response: 'could not complete this request',
      });
    });

    const expectedActions = [
      { type: IS_FETCHING, payload: true },
      { type: FETCHING_DICTIONARIES, payload: 'could not complete this request' },
      { type: IS_FETCHING, payload: false },
    ];

    const store = mockStore({ payload: {} });

    return store.dispatch(fetchDictionaries('', 1000, 1, 'sortAsc=name', 'verbose=true')).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should return a dictionary', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: [dictionaries],
      });
    });
    const expectedActions = [
      { type: IS_FETCHING, payload: true },
      { type: FETCHING_DICTIONARY, payload: [dictionaries] },
      { type: IS_FETCHING, payload: false },
    ];
    const store = mockStore({ payload: {} });
    return store.dispatch(fetchDictionary('/users/chriskala/collections/over/')).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should return concepts in a dictionary', () => {
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
    const store = mockStore({ payload: {} });
    return store.dispatch(fetchDictionaryConcepts('/users/chriskala/collections/over/')).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should return an array of dictionaries on search', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: [dictionaries],
      });
    });

    const expectedActions = [
      { type: IS_FETCHING, payload: true },
      { type: FETCHING_DICTIONARIES, payload: [dictionaries] },
      { type: IS_FETCHING, payload: false },
    ];

    const store = mockStore({ payload: {} });
    return store.dispatch(searchDictionaries('', 1000, 1, 'sortAsc=name', 'verbose=true')).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should return an error message from the db in case of a failed search', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 400,
        response: 'could not complete this request',
      });
    });
    const expectedActions = [
      { type: IS_FETCHING, payload: true },
    ];
    const store = mockStore({ payload: {} });
    return store.dispatch(searchDictionaries('', 1000, 1, 'sortAsc=name', 'verbose=true')).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
  it('should return action type and payload', () => {
    expect(clearDictionary()).toEqual(responseDict);
  });

  it('should dispatch EDIT_DICTIONARY_SUCCESS on success response', () => {
    const dictionary = dictionaries;
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: dictionary,
      });
    });
    const expectedActions = [
      { type: EDIT_DICTIONARY_SUCCESS, payload: dictionary },
    ];
    const store = mockStore({ payload: {} });
    return store.dispatch(editDictionary('/dictionary-url', dictionary)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
  it('should dispatch nothing on edit dictionary failure response', () => {
    const dictionary = dictionaries;
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.reject({
        status: 400,
        response: {
          data: {
            __all__: ['Bad Request'],
          },
        },
      });
    });
    const expectedActions = [];
    const store = mockStore({ payload: {} });
    return store.dispatch(editDictionary('/dictionary-url', dictionary)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});

describe('Test for successful dictionaries fetch, failure and refresh', () => {
  const response = {
    data: {},
  };
  const clearDictionariesData = {
    type: CLEAR_DICTIONARIES,
    payload: [],
  };
  const responseData = {
    type: FETCHING_DICTIONARIES,
    payload: { data: {} },
  };

  it('should clear payload when clearDictionaries is called', () => {
    expect(clearDictionaries(response)).toEqual(clearDictionariesData);
  });

  it('should show errors when isErrored is called', () => {
    expect(isErrored(response)).toEqual(responseData);
    expect(isErrored(response)).toBeTruthy();
  });

  it('should show data when isSuccess is called', () => {
    expect(isSuccess(response)).toEqual(responseData);
    expect(isSuccess(response)).toBeTruthy();
  });

  it('should return a dictionary version', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: [versions],
      });
    });
    const expectedActions = [
      { type: FETCHING_VERSIONS, payload: [versions] },
    ];
    const store = mockStore({ payload: {} });
    return store.dispatch(fetchVersions('/users/chriskala/collections/over/versions/')).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should handle release version', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: [HeadVersion],
      });
    });
    const expectedActions = [
      {
        type: RELEASING_HEAD_VERSION, payload: [HeadVersion],
      },
      {
        payload: false, type: '[ui] toggle spinner',
      },
    ];
    const store = mockStore({ payload: {} });
    return store.dispatch(releaseHead('/users/nesh/collections/test/HEAD/')).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should handle release version network error', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.reject({
        status: 599,
      });
    });
    const expectedActions = [
      {
        payload: false, type: '[ui] toggle spinner',
      },
    ];
    const store = mockStore({ payload: {} });
    return store.dispatch(releaseHead('/users/nesh/collections/test/HEAD/')).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
