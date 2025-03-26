/* eslint-disable */

exports.hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
};

//TYPE IS EITHER SUCCESS OR ERROR

exports.showAlerts = (type, message) => {
  const markup = `<div class='alert alert--${type}'> ${message} </div>`;
  exports.hideAlert();
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
  window.setTimeout(exports.hideAlert, 5000);
};
