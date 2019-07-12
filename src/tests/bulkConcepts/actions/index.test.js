import moxios from 'moxios';
import { notify } from 'react-notify-toast';
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
import api from '../../../redux/api';
import { DELETE_NOTIFICATION, UPSERT_NOTIFICATION } from '../../../redux/actions/notifications';
import { ADDING_CONCEPTS_WARNING_MESSAGE } from '../../../constants';

const mockStore = configureStore([thunk]);
jest.mock('react-notify-toast');

describe('Test suite for source concepts actions', () => {
  api.mappings.fetchFromPublicSources = jest.fn(() => ({ data: [] }));

  beforeEach(() => {
    moxios.install(instance);
  });

  afterEach(() => {
    moxios.uninstall(instance);
  });
  it('should dispatch an error on fetchConceptSources failure', () => {
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

  it('should dispatch FETCH_SOURCE_CONCEPTS  action type on response from server', () => {
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
  it('should dispatch ADD_EXISTING_BULK_CONCEPTS  action type on response from server', () => {
    const notifyMock = jest.fn();
    notify.show = notifyMock;
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: [{ data: { data: [{ added: true }] } }],
      });
    });
    const conceptIdList = [123];
    const notificationId = `adding-${conceptIdList}`;

    const returnedAction = [
      {
        type: UPSERT_NOTIFICATION,
        payload: {
          id: notificationId,
          message: `Adding ${conceptIdList}\n\nFinding dependent concepts...${ADDING_CONCEPTS_WARNING_MESSAGE}`,
        },
      },
      {
        type: UPSERT_NOTIFICATION,
        payload: {
          id: notificationId,
          message: `Adding ${conceptIdList}\n\nFound 0 dependent concepts to add...${ADDING_CONCEPTS_WARNING_MESSAGE}`,
        },
      },
      {
        type: UPSERT_NOTIFICATION,
        payload: {
          id: notificationId,
          message: `Adding ${conceptIdList}\n\nAdding these and 0 dependent concepts...${ADDING_CONCEPTS_WARNING_MESSAGE}`,
        },
      },
      {
        type: ADD_EXISTING_BULK_CONCEPTS,
        payload: [{ data: { data: [{ added: true }] } }],
      },
      {
        type: DELETE_NOTIFICATION,
        payload: {
          id: notificationId,
        },
      },
    ];
    const url = 'uuu';
    const conceptData = { url, data: { data: { expressions: ['/orgs/WHO/sources/ICD-10/concepts/A15.1/'] } }, conceptIdList };

    const store = mockStore({});
    return store.dispatch(addExistingBulkConcepts(conceptData))
      .then(() => {
        expect(store.getActions()).toEqual(returnedAction);
      });
  });
  it('should dispatch an error message when a response is errored', () => {
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
      .then(() => {
        expect(store.getActions()).toEqual(returnedAction);
      });
  });

  it('should dispatch ADD_EXISTING_BULK_CONCEPTS  action type when adding a dictionary reference', () => {
    const conceptUrl = '/orgs/WHO/sources/ICD-10/concepts/A15.2/';
    const ownerUrl = '/orgs/WHO/';
    const dictionaryId = 'ICD-10';
    const store = mockStore({});

    moxios.stubRequest(new RegExp(`.*${conceptUrl}`), {
      status: 200,
      response: [cielConcepts],
    });

    moxios.stubRequest(new RegExp(`.*${ownerUrl}collections/${dictionaryId}/references/`), {
      status: 200,
      response: 'Added',
    });

    const expectedAction = [
      {
        type: ADD_EXISTING_BULK_CONCEPTS,
        payload: 'Added',
      },
    ];

    return store.dispatch(addDictionaryReference(conceptUrl, ownerUrl, dictionaryId))
      .then(() => expect(store.getActions()[0].type).toEqual(expectedAction[0].type));
  });
  it('should dispatch an error when adding bulk concepts', () => {
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
});
