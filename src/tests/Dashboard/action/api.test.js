import moxios from 'moxios';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import instance from '../../../config/axiosConfig';
import { FETCHING_ORGANIZATIONS, ADDING_DICTIONARY } from '../../../redux/actions/types';
import {
  fetchingOrganizations, createDictionary, createDictionaryUser,
} from '../../../redux/actions/dictionaries/dictionaryActionCreators';
import organizations from '../../__mocks__/organizations';

const mockStore = configureStore([thunk]);

jest.mock('react-notify-toast');

describe('Test suite for organization actions', () => {
  beforeEach(() => {
    moxios.install(instance);
  });

  afterEach(() => {
    moxios.uninstall(instance);
  });

  /* eslint-disable */
  it('should return an array of organizations', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: [organizations],
      });
    });

    const expectedActions = [
      { type: FETCHING_ORGANIZATIONS, payload: [organizations] },
    ];

    const store = mockStore({ payload: {} });
    return store
      .dispatch(fetchingOrganizations('ocl', ['Dictionary'], 10, 1, 'sortAsc=name'))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });
});

describe('Test suite for dictionary actions', () => {
  beforeEach(() => {
    moxios.install(instance);
  });

  afterEach(() => {
    moxios.uninstall(instance);
  });

  it('should dispatch ADD_DICTIONARY for organization', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: {
          data: {},
        }
      });
    });

    const expectedActions = [
      { type: ADDING_DICTIONARY, payload: {data: {}} },
    ];

    const store = mockStore({});

    const data = {
     conceptUrl: '/concept-url',
    }

    return store
      .dispatch(createDictionary(data))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('should dispatch ADD_DICTIONARY for user', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: {
          data: {},
        }
      });
    });

    const expectedActions = [
      { type: ADDING_DICTIONARY, payload: {data: {}} },
    ];

    const store = mockStore({});

    const data = {
     conceptUrl: '/concept-url',
    }

    return store
      .dispatch(createDictionaryUser(data))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });
});
