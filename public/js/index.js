/* eslint-disable*/
import '@babel/polyfill';
import { login } from './login';
import { logout } from './login';
import { displayMap } from './mapBox';
import { updateSettings } from './updateSettings';

// DOM EELMENETS
const formElement = document.querySelector('.form--login');
const mapElement = document.querySelector('#map');
const logoutElement = document.querySelector('.nav__el--logout');
const userForm = document.querySelector('.form-user-data');
const passwordForm = document.querySelector('.form-user-settings');

if (formElement) {
  formElement.addEventListener('submit', (e) => {
    e.preventDefault();
    //ha a modal letezik akkor a bejelentkezes folyamatban, nem engedjuk a kerest ujra elkuldeni
    if (document.querySelector('.modal')) {
      return;
    }

    let data;
    let message;
    let url = window.location.pathname.replace('/', '');

    switch (url) {
      case 'login':
        data = createFormData('email', 'password');
        message = 'Logged in succesfully';
        break;
      case 'signup':
        message = 'Your account created successfully ';
        data = createFormData('email', 'password', 'passwordConfirm', 'name');
        break;
      case 'forgotpassword':
        message = 'We sent a request url to your email address';
        data = createFormData('email');
    }

    console.log(data, message);
    login(data, url, message);
  });
}

if (mapElement) {
  const locations = JSON.parse(mapElement.dataset.locations);
  displayMap(locations);
}

if (logoutElement) {
  logoutElement.addEventListener('click', logout);
}

if (userForm) {
  userForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (document.querySelector('.modal')) {
      return;
    }
    const form = new FormData();
    form.append('name', userForm.querySelector('#name').value);
    form.append('email', userForm.querySelector('#email').value);
    form.append('photo', document.querySelector('#photo').files[0]);

    updateSettings(form, 'data');
  });

  userForm.querySelector('.form__upload').addEventListener('change', (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      document.querySelector('.nav__user-img').src = e.target.result;
      document.querySelector('.form__user-photo').src = e.target.result;
    };

    reader.readAsDataURL(file);
  });
}

if (passwordForm) {
  passwordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (document.querySelector('.modal')) {
      return;
    }
    const currentPassword = passwordForm.querySelector('#password-current')
      .value;
    const newPassword = passwordForm.querySelector('#password').value;
    const newPasswordConfirm = passwordForm.querySelector('#password-confirm')
      .value;

    await updateSettings(
      { currentPassword, newPassword, newPasswordConfirm },
      'password'
    );
    passwordForm.querySelector('#password-current').value = '';
    passwordForm.querySelector('#password').value = '';
    passwordForm.querySelector('#password-confirm').value = '';
  });
}

const createFormData = (...ids) => {
  const data = {};
  ids.forEach((id) => {
    data[id] = document.querySelector(`#${id}`).value;
  });
  return data;
};
