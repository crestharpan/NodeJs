/* eslint-disable */
const axios = require('axios');
const alerts = require('./alerts');

exports.login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/V1/users/login',
      data: {
        email,
        password,
      },
    });

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

exports.logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/V1/users/logout',
    });
    // console.log(res.status);
    if (res.status === 200) {
      location.reload();
    }
  } catch (err) {
    alerts.showAlerts('error', 'Error while logging out. Try again!!');
  }
};
