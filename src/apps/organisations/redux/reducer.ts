import { createReducer } from "@reduxjs/toolkit";
import { Action } from "../../../redux";
import {
  GET_USER_ORGS_ACTION,
  CREATE_ORGANISATION_ACTION,
  RETRIEVE_ORGS_ACTION,
  EDIT_ORGANISATION_ACTION,
  GET_ORG_ACTION,
  GET_ORG_SOURCES_ACTION,
  GET_ORG_COLLECTIONS_ACTION,
  GET_ORG_MEMBERS_ACTION,
  SHOW_ADD_MEMBER_DIALOG,
  HIDE_ADD_MEMBER_DIALOG,
  SHOW_DELETE_MEMBER_DIALOG,
  HIDE_DELETE_MEMBER_DIALOG,
  TOGGLE_SHOW_VERIFIED_ACTION
} from "./actionTypes";
import { LOGOUT_ACTION } from "../../authentication/redux/actionTypes";
import { APIOrganisation, OrganisationState } from "../types";

const initialState: OrganisationState = {
  organisations: [],
  organisation: {} as APIOrganisation,
  showAddMemberDialog: false,
  showDeleteMemberDialog: false,
  showOnlyVerified: false
};

export const reducer = createReducer(initialState, {
  [TOGGLE_SHOW_VERIFIED_ACTION]: (state, action) => ({
    ...state,
    showOnlyVerified: !state.showOnlyVerified
  }),
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
    organisation: action.payload
  }),
  [GET_ORG_SOURCES_ACTION]: (state, action) => ({
    ...state,
    orgSources: action.payload
  }),
  [GET_ORG_COLLECTIONS_ACTION]: (state, action) => ({
    ...state,
    orgCollections: action.payload
  }),
  [GET_ORG_MEMBERS_ACTION]: (state, action) => ({
    ...state,
    orgMembers: action.payload
  }),
  [SHOW_ADD_MEMBER_DIALOG]: state => ({
    ...state,
    showAddMemberDialog: true
  }),
  [HIDE_ADD_MEMBER_DIALOG]: state => ({
    ...state,
    showAddMemberDialog: false
  }),
  [SHOW_DELETE_MEMBER_DIALOG]: state => ({
    ...state,
    showDeleteMemberDialog: true
  }),
  [HIDE_DELETE_MEMBER_DIALOG]: state => ({
    ...state,
    showDeleteMemberDialog: false
  }),
  [LOGOUT_ACTION]: () => {
    return initialState;
  }
});

export { reducer as default };
