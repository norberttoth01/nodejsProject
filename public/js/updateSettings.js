/* eslint-disable*/
import axios from 'axios';
import { showAlert, hideAlert } from './alerts';
import { showSpinner, hideSpinner } from './spinner';

export const updateData = async (name, email) => {
  hideAlert();
  showSpinner();
  try {
    const result = await axios({
      method: 'PATCH',
      url: 'http://localhost:8000/api/v1/users/updateMe',
      data: {
        name,
        email,
      },
    });
    if (result.data.status === 'success') {
      hideSpinner();
      updateUserName(result.data.data.user.name.split(' ')[0]);
      showAlert('success', 'Updated successfully');
    }
  } catch (err) {
    hideSpinner();
    showAlert('error', err.response.data.message);
  }
};

const updateUserName = (name) => {
  const nameField = document.querySelector('#name');
  nameField.textContent = name;
};
