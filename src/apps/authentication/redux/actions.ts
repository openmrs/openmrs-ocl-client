import { completeAction, createActionThunk, startAction } from "../../../redux";
import api from "../api";
import {
  GET_PROFILE_ACTION,
  GET_USER_DETAILS_ACTION,
  GET_USER_ORGS_ACTION,
  LOGIN_ACTION,
  LOGOUT_ACTION
} from "./actionTypes";

const loginAction = createActionThunk(LOGIN_ACTION, api.login);
const getProfileAction = createActionThunk(GET_PROFILE_ACTION, api.getProfile);
const getUserOrgsAction = createActionThunk(
  GET_USER_ORGS_ACTION,
  api.getUserOrgs
);
const getUserDetailsAction = () => {
  return async (dispatch: Function) => {
    dispatch(startAction(GET_USER_DETAILS_ACTION));

    let [userProfile, userOrgs] = await Promise.all([
      dispatch(getProfileAction()),
      dispatch(getUserOrgsAction())
    ]);
    if (!(userProfile || userOrgs)) dispatch({ type: LOGOUT_ACTION });

    dispatch(completeAction(GET_USER_DETAILS_ACTION));
  };
};

export { loginAction, getUserDetailsAction };
