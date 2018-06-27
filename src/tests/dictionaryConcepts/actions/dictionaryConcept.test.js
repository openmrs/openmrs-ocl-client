import moxios from 'moxios';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import instance from '../../../config/axiosConfig';
import { IS_FETCHING, FETCH_DICTIONARY_CONCEPT } from '../../../redux/actions/types';
import { fetchDictionaryConcepts } from '../../../redux/actions/concepts/dictionaryConcepts';
import concepts from '../../__mocks__/concepts';

const mockStore = configureStore([thunk]);

describe('Test suite for dictionary concept actions', () => {
  beforeEach(() => {
    moxios.install(instance);
  });

  afterEach(() => {
    moxios.uninstall(instance);
  });

  it('should return an array of concepts', () => {
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

    return store.dispatch(fetchDictionaryConcepts('orgs', 'CIEL', 'CIEL')).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it.skip('should return an error message', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 400,
        response: { data: 'something went wrong' },
      });
    });

    const expectedActions = [
      { type: IS_FETCHING, payload: true },
      // { type: FETCH_DICTIONARY_CONCEPT, payload: 'could not complete this request' },
      { type: IS_FETCHING, payload: false },
    ];

    const store = mockStore({ payload: {} });

    return store.dispatch(fetchDictionaryConcepts('orgs', 'CIEL', 'CIEL')).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
