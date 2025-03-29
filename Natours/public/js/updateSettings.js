const axios = require('axios');
const alerts = require('./alerts');

exports.updateData = async (name, email) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: 'http://127.0.0.1:8080/api/V1/users/updateMe',
      data: {
        name,
        email,
      },
    });
    if (res.data.status === 'success') {
      alerts.showAlerts('success', 'User updated successfully');
    }
  } catch (err) {
    console.log(err.response.data.message);
    alerts.showAlerts('error', err.response.data.message);
  }
};
