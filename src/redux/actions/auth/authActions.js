import axios from 'axios';
import { login, loginFailed, loginStarted, logout } from './authActionCreators';

const BASE_URL = 'https://api.qa.openconceptlab.org/';

const loginAction = ({ username, password }) => async (dispatch) => {
  dispatch(loginStarted());
  let response;
  try {
    const data = {
      username,
      password,
    };

    const loginUrl = `${BASE_URL}/users/login/`;
    const loginResponse = await axios.post(loginUrl, data);
    const { token } = loginResponse.data;
    const headers = { Authorization: `Token ${token}` };
    const url = `${BASE_URL}/users/${username}/`;
    response = await axios.post(url, null, { headers });
    localStorage.setItem('token', `Token ${token}`);
    localStorage.setItem('username', `${username}`);
  } catch (error) {
    if (error.response) {
      return dispatch(loginFailed(error.response.data.detail));
    } else if (error.request) {
      return dispatch(loginFailed('Request cannot be made'));
    }
  }
  return dispatch(login(response));
};

const logoutAction = () => (dispatch) => {
  dispatch(loginStarted());
  dispatch(logout());
  localStorage.clear();
};

export { loginAction, logoutAction };
