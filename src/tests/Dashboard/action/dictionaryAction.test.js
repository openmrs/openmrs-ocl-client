import moxios from 'moxios';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import instance from '../../../config/axiosConfig';
import {
  FETCHING_ORGANIZATIONS,
  ADDING_DICTIONARY, FETCHING_DICTIONARIES, IS_FETCHING,
} from '../../../redux/actions/types';
import {
  fetchOrganizations,
  addDictionary,
} from '../../../redux/actions/dictionaries/dictionaryActions';
import { fetchDictionaries } from '../../../redux/actions/dictionaries/dictionaryActionCreators';
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
      { type: IS_FETCHING, payload: false },
      { type: FETCHING_DICTIONARIES, payload: [dictionaries] },
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
      { type: IS_FETCHING, payload: false },
    ];

    const store = mockStore({ payload: {} });

    return store.dispatch(fetchDictionaries('', 1000, 1, 'sortAsc=name', 'verbose=true')).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
