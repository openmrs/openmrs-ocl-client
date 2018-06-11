import { IS_FETCHING, FETCH_CONCEPTS } from '../types';

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

export { fetchConcepts, isFetching, isErrored };
