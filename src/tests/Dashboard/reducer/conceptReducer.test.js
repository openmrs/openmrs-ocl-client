import reducer from '../../../redux/reducers/ConceptReducers';
import {
  FETCH_CONCEPTS,
  IS_FETCHING,
  SEARCH_CONCEPTS,
  CLEAR_CONCEPTS,
  QUERY_POSSIBLE_ANSWER_CONCEPTS,
  ADD_SELECTED_ANSWERS,
  CHANGE_ANSWER_MAPPING,
} from '../../../redux/actions/types';
import concepts from '../../__mocks__/concepts';

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
  queryResults: [],
  selectedAnswers: [],
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

  it('should add the concepts query results to redux state', () => {
    const payload = [{ concept: 'test' }];
    const newState = reducer(initialState, { type: QUERY_POSSIBLE_ANSWER_CONCEPTS, payload });
    expect(newState.queryResults).toEqual(payload);
  });

  it('should add the selected answers to redux state', () => {
    const payload = [{ answer: 'test' }];
    const newState = reducer(initialState, { type: ADD_SELECTED_ANSWERS, payload });
    expect(newState.selectedAnswers).toEqual(payload);
  });

  it('should add change the answer mapping details and update redux state', () => {
    const changedState = {
      ...initialState,
      selectedAnswers: [{ id: 'testID', map_type: 'Internal' }],
    };
    const payload = { id: 'testID', map_type: 'External' };
    const newState = reducer(changedState, { type: CHANGE_ANSWER_MAPPING, payload });
    expect(newState.selectedAnswers[0].map_type).toEqual('External');
  });
});
