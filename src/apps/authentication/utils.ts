import {AxiosResponse} from "axios";
import store from "../../store";
import {createActionType} from "../../redux";
import {LOGOUT_ACTION} from "./redux";

const logoutAction = createActionType(LOGOUT_ACTION);

const redirectIfNotLoggedIn = (response: AxiosResponse) => {
    if(response.status === 401) {
        // todo redirect to log in page
        store.dispatch(logoutAction());
    }
    return response;
};

const addAuthToken = (data: any, headers: any) => {
    headers['Authorization'] = `Token ${store.getState().auth.token}`;
    return data;
};

console.log(addAuthToken, 1);

export {redirectIfNotLoggedIn, addAuthToken};
