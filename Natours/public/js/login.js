/* eslint-disable */
const axios = require('axios');
const alerts = require('./alerts');
exports.login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:8080/api/V1/users/login',
      data: {
        email,
        password,
      },
    });
    console.log('This is the response', res);
    if (res.data.status === 'success') {
      alerts.showAlerts('success', 'Logged In Success');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    alerts.showAlerts('error', err.response.data.message);
  }
};
