import axios from 'axios';
import {BASE_URL} from "../constants";

/*
* This is the only file in which we use the axios instance directly, in order to avoid a circular dependency
 */
const api = {
    login: (username: string, password: string) => axios.post('/users/login/', {username, password}, {baseURL: BASE_URL}),
};

export default api;
