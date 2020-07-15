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
