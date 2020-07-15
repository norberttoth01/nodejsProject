/* eslint-disable*/
import axios from 'axios';
import { showAlert } from './alerts';

export const updateData = async (name, email) => {
  console.log(name, email);
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
      updateUserName(result.data.data.user.name.split(' ')[0]);
      showAlert('success', 'Updated successfully');
    }
  } catch (err) {
    console.log(err);
    showAlert('error', err.response.data.message);
  }
};

const updateUserName = (name) => {
  const nameField = document.querySelector('#name');
  nameField.textContent = name;
};
