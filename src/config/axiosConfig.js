import axios from 'axios';
import { notify } from 'react-notify-toast';
import urlConfig from './index';
import history from './history';

const instance = axios.create({
  baseURL: urlConfig.OCL_API_HOST,
});

instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
instance.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded';

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    // eslint-disable-next-line
    config.headers['Authorization'] = token;
  } else if (!token) {
    notify.show('Please log in first', 'warning', 3000);
    history.push('/');
    throw new axios.Cancel('Request cancelled. Authentication required');
  }
  return config;
});

export default instance;
