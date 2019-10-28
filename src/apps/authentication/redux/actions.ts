import {createActionThunk, createActionType} from "../../../redux";
import api from "../api";
import {GET_PROFILE_ACTION, LOGIN_ACTION, LOGOUT_ACTION} from "./actionTypes";

const loginAction = createActionThunk(LOGIN_ACTION, api.login);
const logoutAction = createActionType(LOGOUT_ACTION);
const getProfileAction = createActionThunk(GET_PROFILE_ACTION, api.getProfile);

export {loginAction, logoutAction, getProfileAction};
