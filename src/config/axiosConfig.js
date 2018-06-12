import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://api.qa.openconceptlab.org/',
});

instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

instance.interceptors.request.use((config) => {
  // eslint-disable-next-line
  config.headers['Authorization'] = localStorage.getItem('token');
  return config;
});

export default instance;
