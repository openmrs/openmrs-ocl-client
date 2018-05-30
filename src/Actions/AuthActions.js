import axios from 'axios';
import {
  login,
  loginFailed,
  loginStarted,
  logout,
} from '../ActionCreators/AuthActionCreators';

const BASE_URL = 'https://api.openconceptlab.org/';

const loginAction = ({ username, token }) => async (dispatch) => {
  try {
    const url = `${BASE_URL}/users/${username}/`;
    const headers = { Authorization: `Token ${token}` };
    dispatch(loginStarted());
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
