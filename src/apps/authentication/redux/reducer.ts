import {AnyAction} from "redux";
import {loadingSelector} from "../../../redux";
import {errorSelector} from "../../../redux/redux";
import {GET_PROFILE_ACTION, LOGIN_ACTION, LOGOUT_ACTION} from "./actionTypes";

interface AuthState {
    isLoggedIn: boolean;
    token?: string;
}

const initialState: AuthState = {
    isLoggedIn: false,
};

const reducer = (state=initialState, action: AnyAction) => {
    switch (action.type) {
        case LOGIN_ACTION:
            return {...state, isLoggedIn: true, token: action.payload.token};
        case LOGOUT_ACTION:
            return {...state, isLoggedIn: false, token: undefined};
        case GET_PROFILE_ACTION:
            return {...state, profile: action.payload};
        default:
            return state;
    }
};
const authLoadingSelector = loadingSelector(LOGIN_ACTION);
const authErrorsSelector = errorSelector(LOGIN_ACTION);

export {
    reducer as default,
    authLoadingSelector,
    authErrorsSelector,
};
