/* eslint-disable */
const axios = require('axios');
const alerts = require('./alerts');

exports.signup = async (name, email, password, passwordConfirm) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/V1/users/signup',
      data: {
        name,
        email,
        password,
        passwordConfirm,
      },
    });

    if (res.data.status === 'success') {
      alerts.showAlerts('success', 'Sign Up Successful');
      window.setTimeout(() => {
        location.assign('/login');
      }, 1500);
    }
  } catch (err) {
    alerts.showAlerts('error', err.response.data.message);
  }
};
