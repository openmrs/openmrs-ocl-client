import {actionType, createActionThunk} from "../redux/utils";
import api from "./api";
import {AnyAction} from "redux";
import {loadingSelector} from "../redux/redux";

const LOGIN_ACTION = 'authentication/login';
const LOGOUT_ACTION = 'authentication/logout';

interface AuthState {
    isLoggedIn: boolean;
    token?: string;
}

const initialState: AuthState = {
    isLoggedIn: false,
};

const loginAction = createActionThunk(LOGIN_ACTION, api.login);
const logoutAction = actionType(LOGOUT_ACTION);

const reducer = (state=initialState, action: AnyAction) => {
    switch (action.type) {
        case LOGIN_ACTION:
            return {...state, isLoggedIn: true, token: action.payload.token};
        default:
            return state;
    }
};
const authLoadingSelector = loadingSelector(LOGIN_ACTION);

export {reducer as default, loginAction, logoutAction, authLoadingSelector};
