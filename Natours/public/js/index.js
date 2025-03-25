/* eslint-disable */
const { displayMap } = require('./leaflet');
const { login } = require('./login');

//DOM ELEMENTS
const leaflet = document.getElementById('map');
const form = document.querySelector('.form');

// ----------------------------------------------
// Get locations from HTML
// ----------------------------------------------
if (leaflet) {
  const locations = JSON.parse(leaflet.dataset.locations);
  displayMap(locations);
}

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}
