import reducer from '../../../redux/reducers/ConceptReducers';
import { FETCH_CONCEPTS, IS_FETCHING, SEARCH_CONCEPTS, CLEAR_CONCEPTS } from '../../../redux/actions/types';
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
  answer: [],
  paginatedConcepts: [],
  totalConceptCount: 0,
  existingConcept: {
    descriptions: [],
    names: [],
  },
};
describe('Test suite for concepts reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it('should handle setting redux state key concepts to list of concepts and hasMore to false on dispatching actiontype FETCH_CONCEPTS', () => {
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
  });

  it('should handle setting redux state key loading to false on dispatching actiontype IS_FETCHING', () => {
    expect(reducer(
      {},
      {
        type: IS_FETCHING,
        payload: false,
      },
    )).toEqual({
      loading: false,
    });
  });

  it('should handle setting redux state key loading and hasMore to false on dispatching actiontype SEARCH_CONCEPTS', () => {
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
  });

  it('should handle setting redux state key concepts to list of concepts on dispatching actiontype CLEAR_CONCEPTS', () => {
    expect(reducer(
      { concepts: [] },
      {
        type: CLEAR_CONCEPTS,
        payload: false,
      },
    )).toEqual({
      concepts: [],
    });
  });
});
