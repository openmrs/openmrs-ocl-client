import moxios from 'moxios';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import instance from '../../../config/axiosConfig';
import {
  FETCHING_ORGANIZATIONS,
  ADDING_DICTIONARY, FETCHING_DICTIONARIES, IS_FETCHING, CLEAR_DICTIONARIES,
  FETCHING_DICTIONARY, CLEAR_DICTIONARY,
} from '../../../redux/actions/types';
import {
  fetchOrganizations,
  addDictionary,
  clearDictionaries,
  isErrored,
  isSuccess,
  clearDictionary,
} from '../../../redux/actions/dictionaries/dictionaryActions';
import {
  fetchDictionaries,
  searchDictionaries,
  fetchDictionary,
} from '../../../redux/actions/dictionaries/dictionaryActionCreators';
import dictionaries from '../../__mocks__/dictionaries';

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
});
