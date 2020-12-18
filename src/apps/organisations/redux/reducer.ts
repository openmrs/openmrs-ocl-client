import {createReducer} from "@reduxjs/toolkit";
import {
  GET_USER_ORGS_ACTION,
  CREATE_ORGANISATION_ACTION
} from "./actionTypes";
import {LOGOUT_ACTION} from "../../authentication/redux/actionTypes";
import { OrganisationState } from "../types";

const initialState: OrganisationState = {
  organisations: [],
  newOrganisation: undefined
};

export const reducer = createReducer(initialState, {
  [GET_USER_ORGS_ACTION]: (state, action) => ({
      ...state,
      organisations: action.payload
  }),
  [CREATE_ORGANISATION_ACTION]: (state, action) => ({
    ...state,
    newOrganisation: action.payload
  }),
  [LOGOUT_ACTION]: () =>{
      return initialState;
  },
});

export {
  reducer as default
};
