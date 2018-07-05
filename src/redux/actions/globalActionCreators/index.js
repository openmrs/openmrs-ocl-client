import { IS_FETCHING } from '../types';

export const getDictionaryConcepts = (payload, type) => ({
  type,
  payload,
});

export const isSuccess = (payload, type) => ({
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
