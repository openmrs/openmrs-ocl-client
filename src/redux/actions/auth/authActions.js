import axios from 'axios';
import {
  login, loginFailed, loginStarted, logout,
} from './authActionCreators';
import { showNetworkError } from '../dictionaries/dictionaryActionCreators';

const BASE_URL = 'https://api.qa.openconceptlab.org/';

const loginAction = ({ username, password }) => (dispatch) => {
  dispatch(loginStarted());
  const data = {
    username,
    password,
  };

  const loginUrl = `${BASE_URL}/users/login/`;
  return axios.post(loginUrl, data).then((response) => {
    const { token } = response.data;
    localStorage.setItem('token', `Token ${token}`);
    localStorage.setItem('username', `${username}`);
    return dispatch(login(response));
  }).catch((error) => {
    if (error.response === undefined) {
      return showNetworkError();
    }
    let errorMessage = error.response.data.detail;
    if (errorMessage === 'Not found.') {
      errorMessage = 'No such user was found.';
    }
    if (errorMessage === 'Passwords did not match.') {
      errorMessage = 'Either the username or password you provided is incorrect.';
    }
    return dispatch(loginFailed(errorMessage));
  });
};

const logoutAction = () => (dispatch) => {
  dispatch(loginStarted());
  dispatch(logout());
  localStorage.clear();
};

export { loginAction, logoutAction };
