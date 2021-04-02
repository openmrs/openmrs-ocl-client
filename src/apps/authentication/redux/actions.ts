import { completeAction, createActionThunk, startAction } from "../../../redux";
import { getIndexedAction } from "../../../redux/utils";
import api from "../api";
import {
  GET_PROFILE_ACTION,
  GET_USER_DETAILS_ACTION,
  GET_USER_ORGS_ACTION,
  LOGIN_ACTION,
  LOGOUT_ACTION,
  SET_NEXT_PAGE_ACTION,
  CLEAR_NEXT_PAGE_ACTION
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

    let [userProfile] = await Promise.all([dispatch(getProfileAction())]);

    let [userOrgs] = await Promise.all([
      dispatch(getUserOrgsAction(userProfile.username))
    ]);

    if (!(userProfile || userOrgs)) dispatch({ type: LOGOUT_ACTION });

    dispatch(completeAction(GET_USER_DETAILS_ACTION));
  };
};

const setNextPageAction = (nextPage: string) => {
  return async (dispatch: Function) => {
    const action = getIndexedAction(SET_NEXT_PAGE_ACTION);
    dispatch({
      type: action.actionType,
      index: action.actionIndex,
      payload: nextPage
    });
  };
};

const clearNextPageAction = () => {
  return (dispatch: Function) => {
    const { actionType, actionIndex } = getIndexedAction(
      CLEAR_NEXT_PAGE_ACTION
    );
    dispatch({ type: actionType, index: actionIndex });
  };
};

export {
  loginAction,
  getUserDetailsAction,
  getProfileAction,
  setNextPageAction,
  clearNextPageAction
};
