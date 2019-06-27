import moxios from 'moxios';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { notify } from 'react-notify-toast';

import instance from '../../../config/axiosConfig';
import {
  FETCH_USER_DICTIONARY,
  FETCH_USER_ORGANIZATION,
  GET_USER,
  IS_FETCHING,
  CLEAR_DICTIONARY,
  USER_IS_MEMBER,
  USER_IS_NOT_MEMBER,
  NETWORK_ERROR,
  LOGGED_OUT,
} from '../../../redux/actions/types';
import {
  fetchUserData,
  fetchsUserDictionaries,
  fetchUser,
  fetchUserOrganizations,
  clearDictionaryData,
  fetchMemberStatus, fetchOrganizationDictionaries, setDictionariesOwnedByAUsersOrgs,
} from '../../../redux/actions/user';
import dictionary from '../../__mocks__/dictionaries';
import api from '../../../redux/api';
import { isFetching } from '../../../redux/actions/globalActionCreators';

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
      { type: IS_FETCHING, payload: true },
      { type: FETCH_USER_DICTIONARY, payload: [dictionary] },
    ];

    const store = mockStore({});
    return store.dispatch(fetchsUserDictionaries('chriskala')).then(() => {
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

    const expectedActions = [{
      payload: true,
      type: IS_FETCHING,
    }];

    const store = mockStore({});
    return store.dispatch(fetchsUserDictionaries('chriskala')).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
  it('should handle request failure of status code 401 in FETCH_USER_DICTIONARY', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 401,
        response: { message: 'Request failed with status code 401' },
      });
    });

    const expectedActions = [
      {
        payload: true,
        type: IS_FETCHING,
      },
      {
        type: LOGGED_OUT,
        payload: {},
      },
    ];

    const store = mockStore({});
    return store.dispatch(fetchsUserDictionaries('chriskala', { history: { push: jest.fn } })).then(() => {
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
  it('should handle request failure of status code 401 in FETCH_USER_ORGANIZATION', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 401,
        response: { message: 'Request failed with status code 401' },
      });
    });

    const expectedActions = [
      {
        type: LOGGED_OUT,
        payload: {},
      },
    ];

    const store = mockStore({});
    return store.dispatch(fetchUserOrganizations('emasys', { history: { push: jest.fn } })).then(() => {
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

    const expectedActions = [
      {
        type: NETWORK_ERROR,
        payload: 'An error occurred with your internet connection, please fix it and try reloading the page.',
      },
    ];

    const store = mockStore({});
    return store.dispatch(fetchUser('emasys')).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
  it('should handle request failure of status code 401 in GET_USER', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 401,
        response: { message: 'Request failed with status code 401' },
      });
    });

    const expectedActions = [
      {
        type: LOGGED_OUT,
        payload: {},
      },
    ];

    const store = mockStore({});
    return store.dispatch(fetchUser('emasys', { history: { push: jest.fn } })).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
  it('should dispatch USER_IS_MEMBER', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 204,
        response: '',
      });
    });

    const expectedActions = [
      { type: IS_FETCHING, payload: true },
      { type: IS_FETCHING, payload: false },
      { type: USER_IS_MEMBER, payload: true },
    ];

    const store = mockStore({});
    const url = '/orgs/EthiopiaNHDD/members/emmabaye';
    return store.dispatch(fetchMemberStatus(url)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
  it('should dispatch USER_IS_NOT_MEMBER', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.reject({
        status: 404,
        response: {
          status: 404,
        },
      });
    });

    const expectedActions = [
      { type: IS_FETCHING, payload: true },
      { type: IS_FETCHING, payload: false },
      { type: USER_IS_NOT_MEMBER, payload: false },
    ];

    const store = mockStore({});
    const url = '/orgs/EthiopiaNHDD/members/emmabaye';
    return store.dispatch(fetchMemberStatus(url)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  describe('fetchUserData', () => {
    const dispatchMock = jest.fn();
    const getStateMock = jest.fn().mockReturnValueOnce({
      user: {
        userOrganization: [],
      },
    });

    beforeEach(() => {
      dispatchMock.mockClear();
      getStateMock.mockClear();
    });

    it('should dispatch set fetching to true before dispatching other actions and to false afterwards', async () => {
      const action = fetchUserData();
      await action(dispatchMock, getStateMock);
      expect(dispatchMock).toHaveBeenCalledTimes(6);
      expect(dispatchMock.mock.calls[0]).toEqual([isFetching(true)]);
      expect(dispatchMock.mock.calls[dispatchMock.mock.calls.length - 1])
        .toEqual([isFetching(false)]);
    });
  });

  describe('fetchOrganizationDictionaries', () => {
    const organizationUrls = ['/test/url/'];
    const dispatchMock = jest.fn();

    beforeEach(() => {
      dispatchMock.mockClear();
    });

    it('should call the expected endpoint and dispatch SET_DICTIONARIES_OWNED_BY_A_USERS_ORGS', async () => {
      api.dictionaries.list.fromAnOrganization = jest.fn()
        .mockResolvedValueOnce({ data: [dictionary] });

      const action = fetchOrganizationDictionaries(organizationUrls);
      await action(dispatchMock);
      expect(api.dictionaries.list.fromAnOrganization).toHaveBeenCalledWith(organizationUrls[0]);
      expect(dispatchMock).toHaveBeenCalledWith(setDictionariesOwnedByAUsersOrgs([dictionary]));
    });

    it('should notify the user in case of an error', async () => {
      api.dictionaries.list.fromAnOrganization = jest.fn()
        .mockRejectedValueOnce({});
      notify.show = jest.fn();

      const action = fetchOrganizationDictionaries(organizationUrls);
      await action(dispatchMock);
      expect(api.dictionaries.list.fromAnOrganization).toHaveBeenCalledWith(organizationUrls[0]);
      expect(dispatchMock).toHaveBeenCalledWith(setDictionariesOwnedByAUsersOrgs([]));
      expect(notify.show).toHaveBeenCalledWith(
        'Dictionaries owned by your organizations could not be loaded. Try reloading the page.',
        'error',
        '3000',
      );
    });
  });
});
