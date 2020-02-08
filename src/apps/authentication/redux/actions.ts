import {
  completeAction,
  createActionThunk,
  indexedAction,
  startAction
} from "../../../redux";
import api from "../api";
import {
  LOGIN_ACTION,
  LOGOUT_ACTION,
  GET_USER_DETAILS_ACTION,
  GET_PROFILE_ACTION,
  GET_USER_ORGS_ACTION
} from "./actionTypes";

const loginAction = createActionThunk(indexedAction(LOGIN_ACTION), api.login);
const getProfileAction = createActionThunk(
  indexedAction(GET_PROFILE_ACTION),
  api.getProfile
);
const getUserOrgsAction = createActionThunk(
  indexedAction(GET_USER_ORGS_ACTION),
  api.getUserOrgs
);
const getUserDetailsAction = () => {
  return async (dispatch: Function) => {
    dispatch(startAction(indexedAction(GET_USER_DETAILS_ACTION)));

    let [userProfile, userOrgs] = await Promise.all([
      dispatch(getProfileAction()),
      dispatch(getUserOrgsAction())
    ]);
    if (!(userProfile || userOrgs)) dispatch({type: LOGOUT_ACTION});

    dispatch(completeAction(indexedAction(GET_USER_DETAILS_ACTION)));
  };
};

export { loginAction, getUserDetailsAction };
