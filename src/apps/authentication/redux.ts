import api from "./api";
import {AnyAction} from "redux";
import {loadingSelector, createActionType, createActionThunk} from "../../redux";
import {errorSelector} from "../../redux/redux";

const LOGIN_ACTION = 'authentication/login';
const LOGOUT_ACTION = 'authentication/logout';
const GET_PROFILE_ACTION = 'authentication/getProfile';

interface AuthState {
    isLoggedIn: boolean;
    token?: string;
}

const initialState: AuthState = {
    isLoggedIn: false,
};

const loginAction = createActionThunk(LOGIN_ACTION, api.login);
const logoutAction = createActionType(LOGOUT_ACTION);

const reducer = (state=initialState, action: AnyAction) => {
    switch (action.type) {
        case LOGIN_ACTION:
            return {...state, isLoggedIn: true, token: action.payload.token};
        case LOGOUT_ACTION:
            return {...state, isLoggedIn: false, token: undefined};
        default:
            return state;
    }
};
const authLoadingSelector = loadingSelector(LOGIN_ACTION);
const authErrorsSelector = errorSelector(LOGIN_ACTION);

export {reducer as default, loginAction, logoutAction, authLoadingSelector, authErrorsSelector};
