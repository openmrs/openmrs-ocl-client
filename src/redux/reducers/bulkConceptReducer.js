import { FETCH_BULK_CONCEPTS } from '../actions/types';

const userInitialState = {
  bulkConcepts: [],
};
const bulkConcepts = (state = userInitialState, action) => {
  switch (action.type) {
    case FETCH_BULK_CONCEPTS:
      return {
        ...state,
        bulkConcepts: action.payload,
      };
    default:
      return state;
  }
};

export default bulkConcepts;
