import moxios from 'moxios';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import instance from '../../../config/axiosConfig';
import {
  FETCH_USER_DICTIONARY,
  FETCH_USER_ORGANIZATION,
  GET_USER,
  IS_FETCHING,
  FETCH_ORG_DICTIONARY,
  CLEAR_DICTIONARY,
} from '../../../redux/actions/types';
import {
  fetchUserData,
  fetchUserDictionary,
  fetchUser,
  fetchUserOrganizations,
  fetchOrgDictionary,
  clearDictionaryData,
} from '../../../redux/actions/user';
import dictionary from '../../__mocks__/dictionaries';

jest.mock('react-notify-toast');
const mockStore = configureStore([thunk]);

describe('Test suite for user dashboard actions', () => {
  beforeEach(() => {
    moxios.install(instance);
  });

  afterEach(() => {
    moxios.uninstall(instance);
  });

  it('should handle CLEAR_DICTIONARY', () => {
    const expectedActions = [{ type: CLEAR_DICTIONARY, payload: [] }];
    const store = mockStore({});
    store.dispatch(clearDictionaryData());
    expect(store.getActions()).toEqual(expectedActions);
  });
  it('should handle fetchUserData', () => {
    const expectedActions = [{ type: IS_FETCHING, payload: true }];
    const store = mockStore({});
    store.dispatch(fetchUserData('emasys'));
    expect(store.getActions()).toEqual(expectedActions);
  });
  it('should handle FETCH_USER_DICTIONARY', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: [dictionary],
      });
    });

    const expectedActions = [
      { type: FETCH_USER_DICTIONARY, payload: [dictionary] },
      { type: IS_FETCHING, payload: false },
    ];

    const store = mockStore({});
    return store.dispatch(fetchUserDictionary('emasys')).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
  it('should handle error in FETCH_USER_DICTIONARY', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 400,
        response: 'an error occurred',
      });
    });

    const expectedActions = [];

    const store = mockStore({});
    return store.dispatch(fetchUserDictionary('emasys')).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
  it('should handle FETCH_ORG_DICTIONARY', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: [dictionary],
      });
    });

    const expectedActions = [{ type: FETCH_ORG_DICTIONARY, payload: [dictionary] }];

    const store = mockStore({});
    return store.dispatch(fetchOrgDictionary('test-dev')).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
  it('should handle error in FETCH_ORG_DICTIONARY', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 400,
        response: 'an error occurred',
      });
    });

    const expectedActions = [];

    const store = mockStore({});
    return store.dispatch(fetchOrgDictionary('test-dev')).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
  it('should handle FETCH_USER_ORGANIZATION', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: [{ id: 'Test', name: 'Test org', url: '/orgs/Test/' }],
      });
    });

    const expectedActions = [
      {
        type: FETCH_USER_ORGANIZATION,
        payload: [{ id: 'Test', name: 'Test org', url: '/orgs/Test/' }],
      },
    ];

    const store = mockStore({});
    return store.dispatch(fetchUserOrganizations('emasys')).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
  it('should handle error in FETCH_USER_ORGANIZATION', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 400,
        response: 'an error occurred',
      });
    });

    const expectedActions = [];

    const store = mockStore({});
    return store.dispatch(fetchUserOrganizations('emasys')).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
  it('should handle GET_USER', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: [{ id: '1a', name: 'emasys', orgs: 2 }],
      });
    });

    const expectedActions = [
      {
        type: GET_USER,
        payload: [{ id: '1a', name: 'emasys', orgs: 2 }],
      },
    ];

    const store = mockStore({});
    return store.dispatch(fetchUser('emasys')).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
  it('should handle error in GET_USER', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 400,
        response: 'an error occurred',
      });
    });

    const expectedActions = [];

    const store = mockStore({});
    return store.dispatch(fetchUser('emasys')).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
