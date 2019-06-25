import reducer from '../../../redux/reducers/ConceptReducers';
import {
  FETCH_CONCEPTS,
  IS_FETCHING,
  SEARCH_CONCEPTS,
  CLEAR_CONCEPTS,
  ADD_SELECTED_ANSWERS,
  ADD_NEW_ANSWER_ROW,
  REMOVE_SELECTED_ANSWER,
  PRE_POPULATE_ANSWERS,
  UNPOPULATE_PRE_POPULATED_ANSWERS,
  UN_POPULATE_THIS_ANSWER,
  ADD_NEW_SET_ROW,
  REMOVE_SELECTED_SET,
  ADD_SELECTED_SETS,
  PRE_POPULATE_SETS,
  UNPOPULATE_PRE_POPULATED_SETS,
  REPLACE_CONCEPT,
  UNPOPULATE_SET
} from '../../../redux/actions/types';
import concepts, { multipleConceptsMockStore } from '../../__mocks__/concepts';
import { replaceConcept } from '../../../redux/actions/dictionaries/dictionaryActions';

const initialState = {
  concepts: [],
  loading: false,
  dictionaryConcepts: [],
  filteredSources: [],
  filteredClass: [],
  filteredList: [],
  filteredByClass: [],
  filteredBySource: [],
  sourceList: [],
  classList: [],
  hasMore: false,
  newName: [],
  description: [],
  newConcept: {},
  addConceptToDictionary: [],
  paginatedConcepts: [],
  totalConceptCount: 0,
  existingConcept: {
    descriptions: [],
    names: [],
  },
  selectedAnswers: [{
    frontEndUniqueKey: 'intialKey',
  }],
  selectedSets: [{
    frontEndUniqueKey: 'intialKey',
  }],
};
describe('Test suite for concepts reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it(
    // eslint-disable-next-line max-len
    'should handle setting redux state key concepts to list of concepts and hasMore to false on dispatching actiontype FETCH_CONCEPTS',
    () => {
      expect(reducer(
        { concepts: [] },
        {
          type: FETCH_CONCEPTS,
          payload: [concepts],
        },
      )).toEqual({
        concepts: [concepts],
        hasMore: false,
      });
    },
  );

  it(
    // eslint-disable-next-line max-len
    'should handle setting redux state key concepts to list of concepts and hasMore to true on dispatching actiontype FETCH_CONCEPTS',
    () => {
      const newConcepts = [{ id: 1 }, { id: 2 },
        { id: 3 }, { id: 4 },
        { id: 5 }, { id: 6 },
        { id: 7 }, { id: 8 },
        { id: 9 }, { id: 10 },
        { id: 11 }, { id: 12 },
        { id: 13 }, { id: 14 },
        { id: 15 }, { id: 16 },
        { id: 17 }, { id: 18 },
        { id: 19 }, { id: 20 },
        { id: 21 }, { id: 22 },
        { id: 23 }, { id: 24 },
        { id: 25 }];
      expect(reducer(
        { concepts: [] },
        {
          type: FETCH_CONCEPTS,
          payload: newConcepts,
        },
      )).toEqual({
        concepts: newConcepts,
        hasMore: true,
      });
    },
  );

  it(
    // eslint-disable-next-line max-len
    'should handle setting redux state key concepts to list of concepts and hasMore to true on dispatching actiontype FETCH_CONCEPTS',
    () => {
      const newConcepts = [{ id: 1 }, { id: 2 },
        { id: 3 }, { id: 4 },
        { id: 5 }, { id: 6 },
        { id: 7 }, { id: 8 },
        { id: 9 }, { id: 10 },
        { id: 11 }, { id: 12 },
        { id: 13 }, { id: 14 },
        { id: 15 }, { id: 16 },
        { id: 17 }, { id: 18 },
        { id: 19 }, { id: 20 },
        { id: 21 }, { id: 22 },
        { id: 23 }, { id: 24 },
        { id: 25 }];
      expect(reducer(
        { concepts: [] },
        {
          type: FETCH_CONCEPTS,
          payload: newConcepts,
        },
      )).toEqual({
        concepts: newConcepts,
        hasMore: true,
      });
    },
  );

  it(
    // eslint-disable-next-line max-len
    'should handle setting redux state key loading to false on dispatching actiontype IS_FETCHING', () => {
      expect(reducer(
        {},
        {
          type: IS_FETCHING,
          payload: false,
        },
      )).toEqual({
        loading: false,
      });
    },
  );

  it(
    // eslint-disable-next-line max-len
    'should handle setting redux state key loading and hasMore to false on dispatching actiontype SEARCH_CONCEPTS', () => {
      expect(reducer(
        {},
        {
          type: SEARCH_CONCEPTS,
          payload: false,
        },
      )).toEqual({
        loading: false,
        hasMore: false,
      });
    },
  );

  it(
    // eslint-disable-next-line max-len
    'should handle setting redux state key concepts to list of concepts on dispatching actiontype CLEAR_CONCEPTS', () => {
      expect(reducer(
        { concepts: [] },
        {
          type: CLEAR_CONCEPTS,
          payload: false,
        },
      )).toEqual({
        concepts: [],
      });
    },
  );

  it('should add the selected answers to redux state', () => {
    const payload = { answer: { frontEndUniqueKey: 'intialKey' }, uniqueKey: 'intialKey' };
    const newState = reducer(initialState, { type: ADD_SELECTED_ANSWERS, payload });
    expect(newState.selectedAnswers).toEqual([{ frontEndUniqueKey: 'intialKey' }]);
  });

  it('should prepopulate selected answers array', () => {
    const payload = [{ frontEndUniqueKey: 'newIntialKey' }];
    const newState = reducer(initialState, { type: PRE_POPULATE_ANSWERS, payload });
    expect(newState.selectedAnswers).toEqual([{ frontEndUniqueKey: 'newIntialKey' }]);
  });

  it('should prePopulate selected sets array', () => {
    const payload = [{ frontEndUniqueKey: 'newIntialKey' }];
    const newState = reducer(initialState, { type: PRE_POPULATE_SETS, payload });
    expect(newState.selectedSets).toEqual([{ frontEndUniqueKey: 'newIntialKey' }]);
  });

  it('should unpopulate selected answers array', () => {
    const payload = [{ frontEndUniqueKey: 'newIntialKey' }];
    const newState = reducer(initialState, { type: UNPOPULATE_PRE_POPULATED_ANSWERS, payload });
    expect(newState.selectedAnswers).toEqual([{ frontEndUniqueKey: 'intialKey' }]);
  });

  describe('unpopulate prepopulated sets', () => {
    it('should unpopulate selected sets array', () => {
      const payload = [{ frontEndUniqueKey: 'newIntialKey' }];
      const newState = reducer(initialState, { type: UNPOPULATE_PRE_POPULATED_SETS, payload });
      expect(newState.selectedSets).toEqual([{ frontEndUniqueKey: 'intialKey' }]);
    });
  });

  it('should add new answer row', () => {
    const payload = { frontEndUniqueKey: 'newIntialKey' };
    const newState = reducer(initialState, { type: ADD_NEW_ANSWER_ROW, payload });
    expect(newState.selectedAnswers).toEqual([{ frontEndUniqueKey: 'intialKey' }, { frontEndUniqueKey: 'newIntialKey' }]);
  });

  it('should remove answer row', () => {
    const payload = 'intialKey';
    const newState = reducer(initialState, { type: REMOVE_SELECTED_ANSWER, payload });
    expect(newState.selectedAnswers).toEqual([{ frontEndUniqueKey: 'newIntialKey' }]);
  });

  it('should handle UN_POPULATE_THIS_ANSWER', () => {
    const payload = {
      frontEndUniqueKey: 'initialKey',
      prePopulated: false,
    };
    const state = {
      ...initialState,
      selectedAnswers: [
        {
          frontEndUniqueKey: 'initialKey',
          prePopulated: true,
        },
        {
          frontEndUniqueKey: 'initialKey1',
          prePopulated: true,
        },
      ],
    };
    const expected = [
      {
        frontEndUniqueKey: 'initialKey',
        prePopulated: false,
      },
      {
        frontEndUniqueKey: 'initialKey1',
        prePopulated: true,
      },
    ];
    const newState = reducer(state, {
      type: UN_POPULATE_THIS_ANSWER,
      payload
    });
    expect(newState.selectedAnswers)
      .toEqual(expected);
  });

  it('should add the selected sets to redux state', () => {
    const expectedSet = { frontEndUniqueKey: 'newFrontendKey' };
    let state = reducer(initialState, { type: 'init' });
    expect(state.selectedSets).toEqual(initialState.selectedSets);
    const existingSet = state.selectedSets[0];
    const payload = { set: expectedSet, uniqueKey: existingSet.frontEndUniqueKey };
    state = reducer(state, { type: ADD_SELECTED_SETS, payload });
    expect(state.selectedSets).toContainEqual(expectedSet);
  });

  it('should add new set row', () => {
    const expectedSet = { frontEndUniqueKey: 'newFrontEndKey' };
    let state = reducer(initialState, { type: 'init' });
    expect(state.selectedSets).not.toContainEqual(expectedSet);
    state = reducer(state, { type: ADD_NEW_SET_ROW, payload: expectedSet });
    expect(state.selectedSets).toContainEqual(expectedSet);
  });

  it('should remove set row', () => {
    let state = reducer(initialState, { type: 'init' });
    expect(state.selectedSets).toEqual(initialState.selectedSets);
    const existingSet = state.selectedSets[0];
    const setToRemoveKey = existingSet.frontEndUniqueKey;
    expect(state.selectedSets).toContainEqual(existingSet);
    state = reducer(initialState, { type: REMOVE_SELECTED_SET, payload: setToRemoveKey });
    expect(state.selectedSets).not.toContainEqual(existingSet);
  });

  describe(REPLACE_CONCEPT, () => {
    it('should replace a concept in dictionaryConcepts and paginatedConcepts', () => {
      let state = reducer(multipleConceptsMockStore.concepts, 'init');
      const conceptToReplace = state.dictionaryConcepts[0];
      const newConcept = concepts;
      newConcept.id = conceptToReplace.id;
      expect(conceptToReplace).not.toEqual(newConcept);
      state = reducer(state, replaceConcept(newConcept));
      expect(state.dictionaryConcepts[0]).toEqual(newConcept);
      expect(state.paginatedConcepts[0]).toEqual(newConcept);
    });
  });

    it('should replace an existing concepts with the updated one in the selected sets', () => {
    const payload = {
      frontEndUniqueKey: 'initialKey',
      prePopulated: false,
    };
    const state = {
      ...initialState,
      selectedSets: [
        {
          frontEndUniqueKey: 'initialKey',
          prePopulated: true,
        },
        {
          frontEndUniqueKey: 'initialKey1',
          prePopulated: true,
        },
      ],
    };
    const expected = [
      {
        frontEndUniqueKey: 'initialKey',
        prePopulated: false,
      },
      {
        frontEndUniqueKey: 'initialKey1',
        prePopulated: true,
      },
    ];
    const newState = reducer(state, {
      type: UNPOPULATE_SET,
      payload
    });
    expect(newState.selectedSets)
      .toEqual(expected);
  });

});
