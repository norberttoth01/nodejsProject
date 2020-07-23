/* eslint-disable */
import axios from 'axios';
import { showAlert, hideAlert } from './alerts';
import { showSpinner, hideSpinner } from './spinner';

export const login = async (data, url, message) => {
  hideAlert();
  showSpinner();
  try {
    const result = await axios({
      method: url.startsWith('resetPassword') ? 'PATCH' : 'POST',
      url: `http://localhost:8000/api/v1/users/${url}`,
      data,
    });
    console.log(url, url.startsWith('resetPassword'));
    if (result.data.status === 'success') {
      setTimeout(() => {
        location.assign('/');
      }, 250);
      showAlert('success', message);
    }
  } catch (err) {
    console.log(err);
    hideSpinner();
    showAlert('error', err.response.data.message);
  }
};

export const logout = async () => {
  try {
    const result = await axios({
      method: 'GET',
      url: 'http://localhost:8000/api/v1/users/logout',
    });

    if ((result.data.status = 'success')) location.reload(true); // force to reload from the server not from cache
  } catch (err) {
    showAlert('error', 'Error logging out! Please try again');
  }
};
