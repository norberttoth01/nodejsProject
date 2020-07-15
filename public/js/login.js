/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';
export const login = async (email, password) => {
  try {
    const result = await axios({
      method: 'POST',
      url: 'http://localhost:8000/api/v1/users/login',
      data: {
        email,
        password,
      },
    });

    if (result.data.status === 'success') {
      setTimeout(() => {
        location.assign('/');
      }, 1000);
      showAlert('success', 'Logged in succesfully');
    }
  } catch (err) {
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
    console.log(err);
    showAlert('error', 'Error logging out! Please try again');
  }
};
