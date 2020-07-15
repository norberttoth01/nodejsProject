/* eslint-disable */

export const showSpinner = () => {
  const markup = `<div class="modal"><div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
};

export const hideSpinner = () => {
  const spinner = document.querySelector('.modal');
  spinner.remove();
};
