/* eslint-disable*/
import '@babel/polyfill';
import { login } from './login';
import { logout } from './login';
import { displayMap } from './mapBox';

const formElement = document.querySelector('form');
const mapElement = document.querySelector('#map');
const logoutElement = document.querySelector('.nav__el--logout');

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
