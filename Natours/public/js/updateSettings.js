const axios = require('axios');
const alerts = require('./alerts');

//TYPE IS EITHER PASSWORD OR ANOTHER DATA
exports.updateSettings = async (data, type) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `http://127.0.0.1:8080/api/V1/users/${type === 'password' ? 'updatePassword' : 'updateMe'}`,
      data,
    });
    if (res.data.status === 'success') {
      alerts.showAlerts(
        'success',
        `${type === 'password' ? 'Password' : 'Data'} updated successfully`,
      );
    }
  } catch (err) {
    console.log(err.response.data.message);
    alerts.showAlerts('error', err.response.data.message);
  }
};
