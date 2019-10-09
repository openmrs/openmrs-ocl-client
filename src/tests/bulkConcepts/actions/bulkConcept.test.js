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
  CLEAR_BULK_FILTERS,
  SET_SORT_CRITERIA,
  SET_SORT_DIRECTION,
} from '../../../redux/actions/types';
import {
  addToFilterList,
  fetchFilteredConcepts,
  previewConcept,
  addConcept,
  setCurrentPage,
  setNextPage,
  setPreviousPage, recursivelyFetchConceptMappings,
  clearAllBulkFilters, setSortDirectionAction, setSortCriteriaAction,
} from '../../../redux/actions/concepts/addBulkConcepts';
import concepts, { mockConceptStore } from '../../__mocks__/concepts';
import mappings from '../../__mocks__/mappings';
import api from '../../../redux/api';
import { DELETE_NOTIFICATION, UPSERT_NOTIFICATION } from '../../../redux/actions/notifications';
import { ADDING_CONCEPTS_WARNING_MESSAGE } from '../../../constants';

jest.mock('react-notify-toast');
const mockStore = configureStore([thunk]);

describe('Test suite for addBulkConcepts async actions', () => {
  beforeEach(() => {
    api.mappings.fetchFromPublicSources = jest.fn(() => ({ data: [] }));
    moxios.install(instance);
  });

  afterEach(() => {
    moxios.uninstall(instance);
  });
  it('should add concept on ADD_EXISTING_CONCEPTS action dispatch', (done) => {
    const notifyMock = jest.fn();
    notify.show = notifyMock;
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: [{ concepts, ...{ added: true } }],
      });
    });
    const notificationId = `adding-${concepts.id}`;

    const expectedActions = [
      {
        type: UPSERT_NOTIFICATION,
        payload: {
          id: notificationId,
          message: `Adding ${concepts.display_name}\n\nFinding dependent concepts...${ADDING_CONCEPTS_WARNING_MESSAGE}`,
        },
      },
      {
        type: UPSERT_NOTIFICATION,
        payload: {
          id: notificationId,
          message: `Adding ${concepts.display_name}\n\nFound 0 dependent concepts to add...${ADDING_CONCEPTS_WARNING_MESSAGE}`,
        },
      },
      {
        type: UPSERT_NOTIFICATION,
        payload: {
          id: notificationId,
          message: `Adding ${concepts.display_name}\n\nAdding concept...${ADDING_CONCEPTS_WARNING_MESSAGE}`,
        },
      },
      {
        type: ADD_EXISTING_CONCEPTS,
        payload: [{ concepts, ...{ added: true } }],
      },
      {
        type: DELETE_NOTIFICATION,
        payload: {
          id: `adding-${concepts.id}`,
        },
      },
    ];

    const store = mockStore({});
    const params = { type: 'user', typeName: 'emasys', collectionName: 'dev jam' };
    const action = addConcept(
      params,
      { data: { expressions: [concepts.url] } },
      concepts.display_name,
      concepts.id,
    );

    store.dispatch(action).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
      expect(notifyMock).toHaveBeenCalledTimes(1);
      expect(notifyMock).toHaveBeenCalledWith(`Added ${concepts.display_name}.`, 'success', 5000);
      done();
    });
  });

  it('should let the user know how many concepts were added when more than one concept is added', (done) => {
    api.mappings.fetchFromPublicSources = jest.fn()
      .mockReturnValueOnce({ data: [mappings[0]] })
      .mockReturnValueOnce({ data: [] });
    const notifyMock = jest.fn();
    notify.show = notifyMock;

    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: [{ concepts, ...{ added: true, expression: '/some/concepts/' } }, { added: true, expression: '/some/concepts/' }],
      });
    });

    const store = mockStore({});
    const params = { type: 'user', typeName: 'emasys', collectionName: 'dev jam' };
    const action = addConcept(
      params,
      { data: { expressions: [concepts.url] } },
      concepts.display_name,
      concepts.id,
    );

    store.dispatch(action).then(() => {
      expect(notifyMock).toHaveBeenCalledTimes(1);
      expect(notifyMock).toHaveBeenCalledWith(`Added ${concepts.display_name}. 1 dependent concepts were added.`, 'success', 5000);
      done();
    });
  });

  it('should notify user when one tries to add a duplicate concept', (done) => {
    const notifyMock = jest.fn();
    notify.show = notifyMock;
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: [{ concepts, ...{ added: false } }],
      });
    });
    const notificationId = `adding-${concepts.id}`;

    const expectedActions = [
      {
        type: UPSERT_NOTIFICATION,
        payload: {
          id: notificationId,
          message: `Adding ${concepts.display_name}\n\nFinding dependent concepts...${ADDING_CONCEPTS_WARNING_MESSAGE}`,
        },
      },
      {
        type: UPSERT_NOTIFICATION,
        payload: {
          id: notificationId,
          message: `Adding ${concepts.display_name}\n\nFound 0 dependent concepts to add...${ADDING_CONCEPTS_WARNING_MESSAGE}`,
        },
      },
      {
        type: UPSERT_NOTIFICATION,
        payload: {
          id: notificationId,
          message: `Adding ${concepts.display_name}\n\nAdding concept...${ADDING_CONCEPTS_WARNING_MESSAGE}`,
        },
      },
      {
        type: ADD_EXISTING_CONCEPTS,
        payload: [{ concepts, ...{ added: false } }],
      },
      {
        type: DELETE_NOTIFICATION,
        payload: {
          id: `adding-${concepts.id}`,
        },
      },
    ];

    const store = mockStore({});
    const params = { type: 'user', typeName: 'emasys', collectionName: 'dev jam' };
    const action = addConcept(
      params,
      { data: { expressions: [concepts.url] } },
      concepts.display_name,
      concepts.id,
    );

    store.dispatch(action).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
      expect(notifyMock).toHaveBeenCalledTimes(1);
      expect(notifyMock).toHaveBeenCalledWith(`${concepts.display_name} already in collection.`, 'success', 5000);
      done();
    });
  });
  it('should handle FETCH_FILTERED_CONCEPTS with no filters', (done) => {
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

    store.dispatch(fetchFilteredConcepts()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
      done();
    });
  });
  it('should handle FETCH_FILTERED_CONCEPTS with datatype filters', (done) => {
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

    store.dispatch(fetchFilteredConcepts()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
      done();
    });
  });
  it('should handle FETCH_FILTERED_CONCEPTS with classes filters', (done) => {
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

    store.dispatch(fetchFilteredConcepts()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
      done();
    });
  });
  it('should handle FETCH_FILTERED_CONCEPTS with both classes and datatype filters', (done) => {
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

    store.dispatch(fetchFilteredConcepts()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
      done();
    });
  });
  it('should handle error in FETCH_FILTERED_CONCEPTS', (done) => {
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

    store.dispatch(fetchFilteredConcepts()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
      done();
    });
  });
  it('dispatches the current page', (done) => {
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
    store.dispatch(setCurrentPage(currentPage)).then(() => {
      expect(store.getActions()).toEqual(returnedAction);
      done();
    });
  });
  it('dispatches the next page', (done) => {
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
    store.dispatch(setNextPage()).then(() => {
      expect(store.getActions()).toEqual(returnedAction);
      done();
    });
  });
  it('dispatches the previous page', (done) => {
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
    store.dispatch(setPreviousPage()).then(() => {
      expect(store.getActions()).toEqual(returnedAction);
      done();
    });
  });
  it('should notify user when it fails to add a concept', (done) => {
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
    store.dispatch(addConcept(params, [], 'lob dev')).then(() => {
      expect(notifyMock).toHaveBeenCalledTimes(1);
      expect(notifyMock).toHaveBeenCalledWith('Failed to add lob dev. Please Retry', 'error', 3000);
      done();
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

  it('should not recurse on external mappings', async () => {
    fetchFromPublicSourcesMock = jest.fn()
      .mockReturnValueOnce({ data: [{ ...mappings[0], to_concept_url: null }] })
      .mockReturnValueOnce({ data: [mappings[1]] });
    api.mappings.fetchFromPublicSources = fetchFromPublicSourcesMock;
    const result = await recursivelyFetchConceptMappings([conceptCode], 1);
    expect(fetchFromPublicSourcesMock).toHaveBeenCalledTimes(1);
    expect(fetchFromPublicSourcesMock.mock.calls[0][0]).toEqual(conceptCode.toString());
    expect(result).toEqual([]);
  });
});

describe('test suite for addBulkConcepts synchronous action creators', () => {
  beforeEach(() => {
    moxios.install(instance);
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: {},
      });
    });
  });

  afterEach(() => {
    moxios.uninstall(instance);
  });

  it('should handle ADD_TO_DATATYPE_LIST', async () => {
    const store = mockStore(mockConceptStore);
    const expectedActions = [
      { type: ADD_TO_DATATYPE_LIST, payload: 'text' },
    ];
    await store.dispatch(addToFilterList('text', 'datatype'));
    expect(store.getActions()[0]).toEqual(expectedActions[0]);
  });
  it('should handle ADD_TO_CLASS_LIST', async () => {
    const store = mockStore(mockConceptStore);
    const expectedActions = [
      { type: ADD_TO_CLASS_LIST, payload: 'drug' },
    ];
    await store.dispatch(addToFilterList('drug', 'class'));
    expect(store.getActions()[0]).toEqual(expectedActions[0]);
  });

  describe('clearAllBulkFilters', () => {
    beforeEach(() => {
      moxios.install(instance);
      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request.respondWith({
          status: 200,
          response: {},
        });
      });
    });

    afterEach(() => {
      moxios.uninstall(instance);
    });

    it('should dispatch CLEAR_BULK_FILTERS with the right filterType', async () => {
      const filterType = 'classes';
      const store = mockStore(mockConceptStore);
      const expectedActions = [
        { type: CLEAR_BULK_FILTERS, payload: filterType },
      ];
      await store.dispatch(clearAllBulkFilters(filterType));
      expect(store.getActions()[0]).toEqual(expectedActions[0]);
    });
  });

  it('should handle PREVIEW_CONCEPT', async () => {
    const store = mockStore(mockConceptStore);
    const expectedActions = [{ type: PREVIEW_CONCEPT, payload: { id: 123 } }];
    await store.dispatch(previewConcept(123));
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('setSortCriteriaAction should dispatch the correct action type', () => {
    const mock = jest.fn();
    setSortCriteriaAction('criteria')(mock);
    expect(mock).toHaveBeenCalledWith({ type: SET_SORT_CRITERIA, payload: 'criteria' });
  });

  it('setSortDirectionAction should dispatch the correct action type', () => {
    const mock = jest.fn();
    setSortDirectionAction('direction')(mock);
    expect(mock).toHaveBeenCalledWith({ type: SET_SORT_DIRECTION, payload: 'direction' });
  });
});
