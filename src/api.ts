import axios from 'axios';
import {BASE_URL} from "./utils";
import {addAuthToken, redirectIfNotLoggedIn} from "./apps/authentication/utils";

console.log(addAuthToken);

const authenticatedInstance = axios.create({
    baseURL: BASE_URL,
    transformResponse: [redirectIfNotLoggedIn],
    transformRequest: [addAuthToken],
});

const unAuthenticatedInstance = axios.create({
    baseURL: BASE_URL,
});

export {authenticatedInstance, unAuthenticatedInstance};
