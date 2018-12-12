import {
  IS_FETCHING, FETCH_CONCEPTS, CLEAR_CONCEPTS,
} from '../types';

const fetchConcepts = payload => ({
  type: FETCH_CONCEPTS,
  payload,
});
const isErrored = payload => ({
  type: FETCH_CONCEPTS,
  payload,
});
const isFetching = payload => ({
  type: IS_FETCHING,
  payload,
});

export const clearConcepts = () => ({
  type: CLEAR_CONCEPTS,
  payload: [],
});

export {
  fetchConcepts,
  isFetching,
  isErrored,
};
