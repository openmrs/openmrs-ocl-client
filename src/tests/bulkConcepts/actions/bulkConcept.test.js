import moxios from 'moxios';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { notify } from 'react-notify-toast';
import instance from '../../../config/axiosConfig';
import {
  IS_FETCHING,
  ADD_TO_DATATYPE_LIST,
  ADD_TO_CLASS_LIST,
  FETCH_FILTERED_CONCEPTS,
  PREVIEW_CONCEPT,
  ADD_EXISTING_CONCEPTS,
  SET_CURRENT_PAGE,
  SET_NEXT_PAGE,
  SET_PERVIOUS_PAGE,
} from '../../../redux/actions/types';
import {
  addToFilterList,
  fetchFilteredConcepts,
  previewConcept,
  addConcept,
  setCurrentPage,
  setNextPage,
  setPreviousPage, recursivelyFetchConceptMappings,
} from '../../../redux/actions/concepts/addBulkConcepts';
import concepts, { mockConceptStore } from '../../__mocks__/concepts';
import mappings from '../../__mocks__/mappings';
import api from '../../../redux/api';

jest.mock('react-notify-toast');
const mockStore = configureStore([thunk]);

describe('Test suite for addBulkConcepts async actions', () => {

  api.mappings.fetchFromPublicSources = jest.fn(() => ({ data: [] }));
  beforeEach(() => {
    moxios.install(instance);
  });

  afterEach(() => {
    moxios.uninstall(instance);
  });
  it('should add concept on ADD_EXISTING_CONCEPTS action dispatch', async (done) => {
    const notifyMock = jest.fn();
    notify.show = notifyMock;
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: [{ concepts, ...{ added: true } }],
      });
    });

    const expectedActions = [
      { type: ADD_EXISTING_CONCEPTS, payload: [{ concepts, ...{ added: true } }] },
    ];

    const store = mockStore({});
    const params = { type: 'user', typeName: 'emasys', collectionName: 'dev jam' };
    return store.dispatch(addConcept(params, { data: { expressions: ['test'] } }, 'lob dev')).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
      expect(notifyMock).toHaveBeenCalledTimes(1);
      expect(notifyMock).toHaveBeenCalledWith('Just Added - lob dev', 'success', 3000);
      done();
    });
  });
  it('should notify user when one tries to add a duplicate concept', () => {
    const notifyMock = jest.fn();
    notify.show = notifyMock;
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: [{ concepts, ...{ added: false } }],
      });
    });

    const expectedActions = [
      { type: ADD_EXISTING_CONCEPTS, payload: [{ concepts, ...{ added: false } }] },
    ];

    const store = mockStore({});
    const params = { type: 'user', typeName: 'emasys', collectionName: 'dev jam' };
    return store.dispatch(addConcept(params, {data: {expressions: ['test']}}, 'lob dev')).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
      expect(notifyMock).toHaveBeenCalledTimes(1);
      expect(notifyMock).toHaveBeenCalledWith('lob dev already added', 'error', 3000);
    });
  });
  it('should handle FETCH_FILTERED_CONCEPTS with no filters', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: [concepts],
      });
    });

    const expectedActions = [
      { type: IS_FETCHING, payload: true },
      { type: FETCH_FILTERED_CONCEPTS, payload: [concepts] },
      { type: IS_FETCHING, payload: false },
    ];

    const store = mockStore(mockConceptStore);

    return store.dispatch(fetchFilteredConcepts()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
  it('should handle FETCH_FILTERED_CONCEPTS with datatype filters', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: [concepts],
      });
    });

    const expectedActions = [
      { type: IS_FETCHING, payload: true },
      { type: FETCH_FILTERED_CONCEPTS, payload: [concepts] },
      { type: IS_FETCHING, payload: false },
    ];

    const store = mockStore({ bulkConcepts: { datatypeList: ['text'], classList: [] } });

    return store.dispatch(fetchFilteredConcepts()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
  it('should handle FETCH_FILTERED_CONCEPTS with classes filters', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: [concepts],
      });
    });

    const expectedActions = [
      { type: IS_FETCHING, payload: true },
      { type: FETCH_FILTERED_CONCEPTS, payload: [concepts] },
      { type: IS_FETCHING, payload: false },
    ];

    const store = mockStore({ bulkConcepts: { datatypeList: [], classList: ['classList'] } });

    return store.dispatch(fetchFilteredConcepts()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
  it('should handle FETCH_FILTERED_CONCEPTS with both classes and datatype filters', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: [concepts],
      });
    });

    const expectedActions = [
      { type: IS_FETCHING, payload: true },
      { type: FETCH_FILTERED_CONCEPTS, payload: [concepts] },
      { type: IS_FETCHING, payload: false },
    ];

    const store = mockStore({ bulkConcepts: { datatypeList: ['text'], classList: ['classList'] } });

    return store.dispatch(fetchFilteredConcepts()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
  it('should handle error in FETCH_FILTERED_CONCEPTS', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 400,
        response: 'bad request',
      });
    });

    const expectedActions = [
      { type: IS_FETCHING, payload: true },
      { type: IS_FETCHING, payload: false },
    ];

    const store = mockStore(mockConceptStore);

    return store.dispatch(fetchFilteredConcepts()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
  it('dispatches the current page', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
      });
    });

    const returnedAction = [
      { type: SET_CURRENT_PAGE, payload: 1 },
    ];
    const store = mockStore({});
    const currentPage = 1;
    return store.dispatch(setCurrentPage(currentPage))
      .then(() => expect(store.getActions()).toEqual(returnedAction));
  });
  it('dispatches the next page', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
      });
    });

    const returnedAction = [
      { type: SET_NEXT_PAGE, payload: null },
    ];
    const store = mockStore({});
    return store.dispatch(setNextPage())
      .then(() => expect(store.getActions()).toEqual(returnedAction));
  });
  it('dispatches the previous page', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
      });
    });

    const returnedAction = [
      { type: SET_PERVIOUS_PAGE, payload: null },
    ];
    const store = mockStore({});
    return store.dispatch(setPreviousPage())
      .then(() => expect(store.getActions()).toEqual(returnedAction));
  });
  it('should notify user when it fails to add a concept', () => {
    const notifyMock = jest.fn();
    notify.show = notifyMock;
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: [{ concepts, ...{ added: false } }],
      });
    });

    const store = mockStore({});
    const params = { type: 'user', typeName: 'emasys', collectionName: 'dev jam' };
    return store.dispatch(addConcept(params, [], 'lob dev')).then(() => {
      expect(notifyMock).toHaveBeenCalledTimes(1);
      expect(notifyMock).toHaveBeenCalledWith('Failed to add lob dev. Please Retry', 'error', 3000);
    });
  });
});

describe('recursivelyFetchConceptMappings', () => {
  const conceptCode = 100;
  let fetchFromPublicSourcesMock;

  beforeEach(() => {
    fetchFromPublicSourcesMock = jest.fn()
      .mockReturnValueOnce({ data: [mappings[0]] })
      .mockReturnValueOnce({ data: [mappings[1]] });
    api.mappings.fetchFromPublicSources = fetchFromPublicSourcesMock;
  });

  it('should return a single level of mappings when called with 0 levelsToCheck', async () => {
    fetchFromPublicSourcesMock.mockClear();
    const result = await recursivelyFetchConceptMappings([conceptCode], 0);
    expect(fetchFromPublicSourcesMock).toHaveBeenCalledTimes(1);
    expect(fetchFromPublicSourcesMock).toHaveBeenCalledWith(conceptCode.toString());
    expect(result).toEqual([mappings[0].to_concept_url]);
  });

  it('should return two levels of mappings when called with 1 levelsToCheck', async () => {
    fetchFromPublicSourcesMock.mockClear();
    const result = await recursivelyFetchConceptMappings([conceptCode], 1);
    expect(fetchFromPublicSourcesMock).toHaveBeenCalledTimes(2);
    expect(fetchFromPublicSourcesMock.mock.calls[0][0]).toEqual(conceptCode.toString());
    expect(fetchFromPublicSourcesMock.mock.calls[1][0]).toEqual(mappings[0].to_concept_code);
    expect(result).toEqual([mappings[0].to_concept_url, mappings[1].to_concept_url]);
  });

  it('should not return duplicate concept references', async () => {
    fetchFromPublicSourcesMock = jest.fn()
      .mockReturnValueOnce({ data: [mappings[0]] })
      .mockReturnValueOnce({ data: [mappings[0]] });
    api.mappings.fetchFromPublicSources = fetchFromPublicSourcesMock;
    const result = await recursivelyFetchConceptMappings([conceptCode], 1);
    expect(fetchFromPublicSourcesMock).toHaveBeenCalledTimes(2);
    expect(fetchFromPublicSourcesMock.mock.calls[0][0]).toEqual(conceptCode.toString());
    expect(fetchFromPublicSourcesMock.mock.calls[1][0]).toEqual(mappings[0].to_concept_code);
    expect(result).toEqual([mappings[0].to_concept_url]);
  });
});

describe('test suite for addBulkConcepts synchronous action creators', () => {
  it('should handle ADD_TO_DATATYPE_LIST', () => {
    const store = mockStore(mockConceptStore);
    const expectedActions = [
      { type: ADD_TO_DATATYPE_LIST, payload: 'text' },
      { payload: true, type: '[ui] toggle spinner' },
    ];
    store.dispatch(addToFilterList('text', 'datatype'));
    expect(store.getActions()).toEqual(expectedActions);
  });
  it('should handle ADD_TO_CLASS_LIST', () => {
    const store = mockStore(mockConceptStore);
    const expectedActions = [
      { type: ADD_TO_CLASS_LIST, payload: 'drug' },
      { payload: true, type: '[ui] toggle spinner' },
    ];
    store.dispatch(addToFilterList('drug', 'class'));
    expect(store.getActions()).toEqual(expectedActions);
  });
  it('should handle PREVIEW_CONCEPT', () => {
    const store = mockStore(mockConceptStore);
    const expectedActions = [{ type: PREVIEW_CONCEPT, payload: { id: 123 } }];
    store.dispatch(previewConcept(123));
    expect(store.getActions()).toEqual(expectedActions);
  });
});
