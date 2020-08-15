import { createReducer } from "@reduxjs/toolkit";
import { Action, startAction } from "../../../redux";
import { DictionaryState } from "../types";
import {
  ADD_CONCEPTS_TO_DICTIONARY,
  CREATE_DICTIONARY_ACTION,
  CREATE_DICTIONARY_VERSION_ACTION,
  CREATE_SOURCE_AND_DICTIONARY_ACTION,
  EDIT_DICTIONARY_ACTION,
  EDIT_SOURCE_AND_DICTIONARY_ACTION,
    EDIT_DICTIONARY_VERSION_ACTION,
  RETRIEVE_DICTIONARIES_ACTION,
  RETRIEVE_DICTIONARY_ACTION,
  RETRIEVE_DICTIONARY_VERSIONS_ACTION
} from "./actionTypes";
import {LOGOUT_ACTION} from "../../authentication/redux/actionTypes";

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
    [EDIT_DICTIONARY_VERSION_ACTION]: (state, {actionIndex, payload}) => {
        const versionIndex = state.versions.findIndex(
            version => version.id === payload.id
        );
        if (versionIndex !== -1) state.versions[versionIndex] = payload;
        else state.versions.push(payload);
    },
  [ADD_CONCEPTS_TO_DICTIONARY]: (state, { actionIndex, payload, meta }) => {
    state.addReferencesResults[actionIndex] = { payload, meta };
  },
  [CREATE_DICTIONARY_VERSION_ACTION]: (
    state,
    { actionIndex, payload, meta }
  ) => {
    state.versions = [payload, ...state.versions];
  },
  [LOGOUT_ACTION]: () =>{
    return initialState;
  },
});
export { reducer as default };
