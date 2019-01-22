import moxios from 'moxios';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import instance from '../../../config/axiosConfig';
import {
  IS_FETCHING,
  FETCH_BULK_CONCEPTS,
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
  fetchBulkConcepts,
  addToFilterList,
  fetchFilteredConcepts,
  previewConcept,
  addConcept,
  setCurrentPage,
  setNextPage,
  setPreviousPage,
} from '../../../redux/actions/concepts/addBulkConcepts';
import concepts, { mockConceptStore } from '../../__mocks__/concepts';

jest.mock('react-notify-toast');
const mockStore = configureStore([thunk]);

describe('Test suite for addBulkConcepts async actions', () => {
  beforeEach(() => {
    moxios.install(instance);
  });

  afterEach(() => {
    moxios.uninstall(instance);
  });

  it('should handle FETCH_BULK_CONCEPTS', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: [concepts],
      });
    });

    const expectedActions = [
      { type: IS_FETCHING, payload: true },
      { type: FETCH_BULK_CONCEPTS, payload: [concepts] },
      { type: IS_FETCHING, payload: false },
    ];

    const store = mockStore({});

    return store.dispatch(fetchBulkConcepts()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
  it('should handle error in FETCH_BULK_CONCEPTS', () => {
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

    const store = mockStore({});

    return store.dispatch(fetchBulkConcepts()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
  it('should handle ADD_EXISTING_CONCEPTS', () => {
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
    return store.dispatch(addConcept(params, 'data', 'lob dev')).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
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
