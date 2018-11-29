import axios from 'axios';
import {
  login, loginFailed, loginStarted, logout,
} from './authActionCreators';

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
    if (error.response) {
      return dispatch(loginFailed(error.response.data.detail));
    }
    return dispatch(loginFailed('Request cannot be made'));
  });
};

const logoutAction = () => (dispatch) => {
  dispatch(loginStarted());
  dispatch(logout());
  localStorage.clear();
};

export { loginAction, logoutAction };
