import axios from 'axios';
import { login, loginFailed, loginStarted, logout } from './authActionCreators';

const BASE_URL = 'https://api.qa.openconceptlab.org/';

const loginAction = ({ username, password }) => async (dispatch) => {
  try {
    const data = {
      username,
      password,
    };

    const loginUrl = `${BASE_URL}/users/login/`;
    const loginResponse = await axios.post(loginUrl, data);
    const { token } = loginResponse.data;
    const headers = { Authorization: `Token ${token}` };
    dispatch(loginStarted());

    const url = `${BASE_URL}/users/${username}/`;
    const response = await axios.post(url, null, { headers });
    dispatch(login(response));

    localStorage.setItem('token', `Token ${token}`);
    localStorage.setItem('username', `${username}`);
  } catch (error) {
    if (error.response) {
      dispatch(loginFailed(error.response.data.detail));
    } else if (error.request) {
      dispatch(loginFailed("Request can't be made"));
    }
  }
};

const logoutAction = () => (dispatch) => {
  dispatch(loginStarted());
  dispatch(logout());
  localStorage.clear();
};

export { loginAction, logoutAction };
