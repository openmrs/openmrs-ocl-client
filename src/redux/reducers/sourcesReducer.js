import {
  FETCH_SOURCES,
  IS_FETCHING,
  SEARCH_SOURCES,
  CLEAR_SOURCES,
} from '../actions/types';

const initialState = {
  sources: [],
  loading: false,
  hasMore: false,
};
export default (state = initialState, action) => {
  const calculatePayload = () => {
    if (action.payload.length === 25) {
      return {
        ...state,
        sources: [...state.sources, ...action.payload],
        hasMore: true,
      };
    }
    return {
      ...state,
      sources: [...state.sources, ...action.payload],
      hasMore: false,
    };
  };

  switch (action.type) {
    case FETCH_SOURCES:
      return calculatePayload();
    case IS_FETCHING:
      return {
        ...state,
        loading: action.payload,
      };
    case SEARCH_SOURCES:
      return {
        ...state,
        sources: action.payload,
        hasMore: false,
      };
    case CLEAR_SOURCES:
      return {
        ...state,
        sources: [],
      };
    default:
      return state;
  }
};
