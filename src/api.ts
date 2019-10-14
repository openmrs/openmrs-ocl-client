import axios, {AxiosResponse} from 'axios';
import store from "./store";
import {logoutAction} from "./authentication";
import {BASE_URL} from "./constants";

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

const authenticatedInstance = axios.create({
    baseURL: BASE_URL,
    transformResponse: [redirectIfNotLoggedIn],
    transformRequest: [addAuthToken],
});

const unAuthenticatedInstance = axios.create({
    baseURL: BASE_URL,
});

export {authenticatedInstance, unAuthenticatedInstance};
