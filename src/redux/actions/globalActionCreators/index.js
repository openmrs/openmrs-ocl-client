import { IS_FETCHING } from '../types';

export const fetchDictionaryConcepts = (payload, type) => ({
  type,
  payload,
});

export const isErrored = (payload, type) => ({
  type,
  payload,
});

export const isFetching = payload => ({
  type: IS_FETCHING,
  payload,
});
