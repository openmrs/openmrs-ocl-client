import { notify } from 'react-notify-toast';

export const getLoggedInUsername = () => localStorage.getItem('username');
export const buildPartialSearchQuery = query => query.replace(new RegExp(' ', 'g'), '* ');
export const checkErrorMessage = (error, message) => {
  if (error && error.response && error.response.data && error.response.data.detail) {
    notify.show(error.response.data.detail, 'error', 3000);
  } else if (error && error.response && error.response.data) {
    notify.show(error.response.data, 'error', 3000);
  } else {
    notify.show(message, 'error', 3000);
  }
};

export const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
