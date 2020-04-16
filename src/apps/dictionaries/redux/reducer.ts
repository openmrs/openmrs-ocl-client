import { createReducer } from "@reduxjs/toolkit";
import { Action, indexedAction, startAction } from "../../../redux";
import { DictionaryState } from "../types";
import {
  ADD_CONCEPTS_TO_DICTIONARY,
  CREATE_DICTIONARY_ACTION,
  CREATE_DICTIONARY_VERSION_ACTION,
  CREATE_SOURCE_AND_DICTIONARY_ACTION,
  EDIT_DICTIONARY_ACTION,
  EDIT_SOURCE_AND_DICTIONARY_ACTION,
  RETRIEVE_DICTIONARIES_ACTION,
  RETRIEVE_DICTIONARY_ACTION,
  RETRIEVE_DICTIONARY_VERSIONS_ACTION
} from "./actionTypes";

const initialState: DictionaryState = {
  dictionaries: [],
  versions: [],
  addReferencesResults: []
};
export const reducer = createReducer(initialState, {
  [startAction(CREATE_SOURCE_AND_DICTIONARY_ACTION).type]: state => ({
    ...state,
    newDictionary: undefined
  }),
  [CREATE_DICTIONARY_ACTION]: (state, action) => ({
    ...state,
    newDictionary: action.payload
  }),
  [RETRIEVE_DICTIONARY_ACTION]: (state, action) => ({
    ...state,
    dictionary: action.payload
  }),
  [RETRIEVE_DICTIONARIES_ACTION]: (
    state,
    { actionIndex, payload, responseMeta }: Action
  ) => {
    state.dictionaries[actionIndex] = { items: payload, responseMeta };
  },
  [startAction(EDIT_SOURCE_AND_DICTIONARY_ACTION).type]: state => ({
    ...state,
    editedDictionary: undefined
  }),
  [EDIT_DICTIONARY_ACTION]: (state, action) => ({
    ...state,
    editedDictionary: action.payload
  }),
  [RETRIEVE_DICTIONARY_VERSIONS_ACTION]: (state, action) => ({
    ...state,
    versions: action.payload
  }),
  [ADD_CONCEPTS_TO_DICTIONARY]: (state, { actionIndex, payload, meta }) => {
    state.addReferencesResults[actionIndex] = { payload, meta };
  },
  [CREATE_DICTIONARY_VERSION_ACTION]: (
    state,
    { actionIndex, payload, meta }
  ) => {
    state.versions = [payload, ...state.versions];
  }
});
export { reducer as default };
