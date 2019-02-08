import moxios from 'moxios';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import instance from '../../../config/axiosConfig';
import {
  FETCH_SOURCE_CONCEPTS,
  IS_FETCHING,
  ADD_EXISTING_BULK_CONCEPTS,
  CLEAR_SOURCE_CONCEPTS,
  FETCH_CONCEPT_SOURCES,
  IS_LOADING,
} from '../../../redux/actions/types';
import
fetchCielConcepts,
{ addExistingBulkConcepts, addDictionaryReference, fetchConceptSources } from '../../../redux/actions/bulkConcepts';
import cielConcepts from '../../__mocks__/concepts';

const mockStore = configureStore([thunk]);
jest.mock('react-notify-toast');

describe('Test suite for source concepts actions', () => {
  beforeEach(() => {
    moxios.install(instance);
  });

  afterEach(() => {
    moxios.uninstall(instance);
  });

  it('dispatches FETCH_SOURCE_CONCEPTS  action type on respose from server', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: [{ cielConcepts: { cielConcepts } }],
      });
    });

    const returnedAction = [
      { type: CLEAR_SOURCE_CONCEPTS },
      { type: IS_LOADING, payload: true },
      { type: FETCH_SOURCE_CONCEPTS, payload: [{ cielConcepts: { cielConcepts } }] },
      { type: IS_LOADING, payload: false },
    ];
    const store = mockStore({});
    return store.dispatch(fetchCielConcepts())
      .then(() => expect(store.getActions()).toEqual(returnedAction));
  });
  it('dispatches ADD_EXISTING_BULK_CONCEPTS  action type on respose from server', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: [{ data: { data: [{ added: true }] } }],
      });
    });

    const returnedAction = [{
      type: ADD_EXISTING_BULK_CONCEPTS,
      payload: [{ data: { data: [{ added: true }] } }],
    }];
    const data = { expressions: ['/orgs/WHO/sources/ICD-10/concepts/A15.1/'] };
    const store = mockStore({});
    return store.dispatch(addExistingBulkConcepts(data))
      .then(() => expect(store.getActions()).toEqual(returnedAction));
  });
  it('dispatches an error message when a response is errored', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 400,
        response: 'could not complete this request',
      });
    });

    const returnedAction = [
      { type: CLEAR_SOURCE_CONCEPTS },
      { type: IS_LOADING, payload: true },
      { type: FETCH_SOURCE_CONCEPTS, payload: 'could not complete this request' },
      { type: IS_LOADING, payload: false },
    ];
    const store = mockStore({});
    return store.dispatch(fetchCielConcepts())
      .then(() => expect(store.getActions()).toEqual(returnedAction));
  });

  it('dispatches ADD_EXISTING_BULK_CONCEPTS  when adding dictionary reference', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: {
          data: [],
        },
      });
    });

    const expectedAction = [];

    const conceptUrl = '/orgs/WHO/sources/ICD-10/concepts/A15.2/';
    const ownerUrl = '/orgs/WHO/';
    const dictionaryId = 'ICD-10';
    const store = mockStore({});

    return store.dispatch(addDictionaryReference(conceptUrl, ownerUrl, dictionaryId))
      .then(() => expect(store.getActions()).toEqual(expectedAction));
  });
  it('dispatches an error when adding bulk concepts', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.reject({
        status: 400,
      });
    });
    const returnedAction = [];
    const data = { expressions: ['/orgs/WHO/sources/ICD-10/concepts/A15.1/'] };
    const store = mockStore({});
    return store.dispatch(addExistingBulkConcepts(data))
      .catch(() => expect(store.getActions()).toEqual(returnedAction));
  });

  it('dispatches FETCH_CONCEPT_SOURCES  action type on fetchConceptSources success', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: [],
      });
    });

    const returnedAction = [
      { type: IS_FETCHING, payload: true },
      { type: CLEAR_SOURCE_CONCEPTS },
      { type: FETCH_CONCEPT_SOURCES, payload: [] },
      { type: IS_FETCHING, payload: false },
    ];
    const store = mockStore({});
    return store.dispatch(fetchConceptSources())
      .then(() => expect(store.getActions()).toEqual(returnedAction));
  });

  it('dispatches an error on fetchConceptSources failure', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.reject({
        status: 400,
        response: { data: 'error' },
      });
    });
    const returnedAction = [
      { type: IS_FETCHING, payload: true },
      { type: CLEAR_SOURCE_CONCEPTS },
      { type: FETCH_CONCEPT_SOURCES, payload: 'error' },
      { type: IS_FETCHING, payload: false },
    ];
    const store = mockStore({});
    return store.dispatch(fetchConceptSources())
      .then(() => expect(store.getActions()).toEqual(returnedAction));
  });
});
