import { createReducer } from "@reduxjs/toolkit";
import { Action } from "../../../redux";
import { SourceState } from "../types";
import {
  CREATE_SOURCE_ACTION,
  EDIT_SOURCE_ACTION,
  RETRIEVE_SOURCE_ACTION,
  RETRIEVE_SOURCES_ACTION,
  RETRIEVE_SOURCE_VERSIONS_ACTION,
  EDIT_SOURCE_VERSION_ACTION,
  CREATE_SOURCE_VERSION_ACTION,
  TOGGLE_SHOW_VERIFIED_ACTION
} from "./actionTypes";
import { LOGOUT_ACTION } from "../../authentication/redux/actionTypes";

const initialState: SourceState = {
  sources: [],
  versions: [],
  showOnlyVerified: false
};

export const reducer = createReducer(initialState, {
  [TOGGLE_SHOW_VERIFIED_ACTION]: (state, action) => ({
    ...state,
    showOnlyVerified: !state.showOnlyVerified
  }),
  [CREATE_SOURCE_ACTION]: (state, action) => ({
    ...state,
    newSource: action.payload
  }),
  [RETRIEVE_SOURCES_ACTION]: (
    state,
    { actionIndex, payload, responseMeta }: Action
  ) => {
    state.sources[actionIndex] = { items: payload, responseMeta };
  },
  [RETRIEVE_SOURCE_ACTION]: (state, action) => ({
    ...state,
    source: action.payload
  }),
  [EDIT_SOURCE_ACTION]: (state, action) => ({
    ...state,
    editedSource: action.payload
  }),
  [RETRIEVE_SOURCE_VERSIONS_ACTION]: (state, action) => ({
    ...state,
    versions: action.payload
  }),
  [EDIT_SOURCE_VERSION_ACTION]: (state, { actionIndex, payload }) => {
    const versionIndex = state.versions.findIndex(
      version => version.id === payload.id
    );
    if (versionIndex !== -1) state.versions[versionIndex] = payload;
    else state.versions.push(payload);
  },
  [CREATE_SOURCE_VERSION_ACTION]: (state, { actionIndex, payload, meta }) => {
    state.versions = [payload, ...state.versions];
  },
  [LOGOUT_ACTION]: () => {
    return initialState;
  }
});
export { reducer as default };
