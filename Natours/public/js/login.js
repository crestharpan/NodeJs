/* eslint-disable */
const axios = require('axios');
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
      alert('Logged in Successfully');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    alert(err.response.data.message);
  }
};
