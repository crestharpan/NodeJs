const nodemailer = require('nodemailer');

const sendEmail = (options) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail', //CAN BE EITHER HOTMAIL YAHOO OR OTHERS
    auth: {
      user: process.env.USERNAME_EMAIL,
      password: process.env.PASSWORD_EMAIL,
    },
  });
};
