/* eslint-disable*/
import '@babel/polyfill';
import { login } from './login';
import { logout } from './login';
import { displayMap } from './mapBox';
import { updateData } from './updateSettings';

const formElement = document.querySelector('.form--login');
const mapElement = document.querySelector('#map');
const logoutElement = document.querySelector('.nav__el--logout');
const userForm = document.querySelector('.form-user-data');

if (formElement) {
  formElement.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;
    login(email, password);
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
    const name = userForm.querySelector('#name').value;
    const email = userForm.querySelector('#email').value;
    updateData(name, email);
  });
}
