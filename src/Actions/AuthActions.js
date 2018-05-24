import axios from 'axios';
import {
  Login,
  LoginFailed,
  LoginStarted,
  Logout,
} from '../ActionCreators/AuthActionCreators';

const BASE_URL = 'https://api.openconceptlab.org/';

const LoginAction = ({ username, token }) => async (dispatch) => {
  try {
    const url = `${BASE_URL}/users/${username}/`;
    const headers = { Authorization: `Token ${token}` };
    dispatch(LoginStarted());
    const response = await axios.post(url, null, { headers });
    dispatch(Login(response));
    localStorage.setItem('token', `Token ${token}`);
    localStorage.setItem('username', `${username}`);
  } catch (error) {
    if (error.response) {
      dispatch(LoginFailed(error.response.data.detail));
    } else if (error.request) {
      dispatch(LoginFailed("Request can't be made"));
    }
  }
};

const LogoutAction = () => (dispatch) => {
  dispatch(LoginStarted());
  dispatch(Logout());
  localStorage.clear();
};

export { LoginAction, LogoutAction };
