import {createReducer} from "@reduxjs/toolkit";
import { Action } from "../../../redux";
import {
  GET_USER_ORGS_ACTION,
  CREATE_ORGANISATION_ACTION,
  RETRIEVE_ORGS_ACTION,
  EDIT_ORGANISATION_ACTION,
  GET_ORG_ACTION,
  GET_ORG_SOURCES_ACTION,
  GET_ORG_COLLECTIONS_ACTION
} from "./actionTypes";
import {LOGOUT_ACTION} from "../../authentication/redux/actionTypes";
import { OrganisationState } from "../types";

const initialState: OrganisationState = {
  organisations: [],
  organisation: {}
}
export const reducer = createReducer(initialState, {
  [GET_USER_ORGS_ACTION]: (state, { payload, responseMeta }: Action) => ({
      ...state,
      organisations: payload,
      meta: responseMeta
  }),
  [RETRIEVE_ORGS_ACTION]: (
    state,
    { actionIndex, payload, responseMeta }: Action
  ) => {
    state.organisations[actionIndex] = { items: payload, responseMeta };
  },
  [CREATE_ORGANISATION_ACTION]: (state, action) => ({
    ...state,
    newOrganisation: action.payload
  }),
  [EDIT_ORGANISATION_ACTION]: (state, action) => ({
    ...state,
    editedOrganisation: action.payload
  }),
  [GET_ORG_ACTION]: (state, action) => ({
    ...state,
    organisation: action.payload,
  }),
  [GET_ORG_SOURCES_ACTION]: (state, action) => ({
    ...state,
    orgSources: action.payload
  }),
  [GET_ORG_COLLECTIONS_ACTION]: (state, action) => ({
    ...state,
    orgCollections: action.payload
  }),
  [LOGOUT_ACTION]: () =>{
      return initialState;
  },
});

export {
  reducer as default
};
