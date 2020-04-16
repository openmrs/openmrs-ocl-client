import { AnyAction } from "redux";
import { errorSelector, loadingSelector } from "../../../redux";
import {
  GET_PROFILE_ACTION,
  GET_USER_DETAILS_ACTION,
  GET_USER_ORGS_ACTION,
  LOGIN_ACTION,
  LOGOUT_ACTION
} from "./actionTypes";
import { AuthState } from "../types";

const initialState: AuthState = {
  isLoggedIn: false
};

const reducer = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case LOGIN_ACTION:
      return { ...state, isLoggedIn: true, token: action.payload.token };
    case LOGOUT_ACTION:
      return { ...state, isLoggedIn: false, token: undefined };
    case GET_PROFILE_ACTION:
      return { ...state, profile: action.payload };
    case GET_USER_ORGS_ACTION:
      return { ...state, orgs: action.payload };
    default:
      return state;
  }
};
const authLoadingSelector = loadingSelector(LOGIN_ACTION);
const authErrorsSelector = errorSelector(LOGIN_ACTION);

const getUserDetailsLoadingSelector = loadingSelector(
  GET_USER_DETAILS_ACTION
);
const profileSelector = ({ auth }: { auth: AuthState }) => auth.profile;
const orgsSelector = ({ auth }: { auth: AuthState }) => auth.orgs;

export {
  reducer as default,
  authLoadingSelector,
  authErrorsSelector,
  getUserDetailsLoadingSelector,
  profileSelector,
  orgsSelector
};
