const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const pug = require('pug');
const { htmlToText } = require('html-to-text');
const nodemailerSendgrid = require('nodemailer-sendgrid');

dotenv.config({ path: '../config.env' });

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Arpan Shrestha <arpanshrestha225@gmail.com>`;
  }

  newTransport() {
    if (process.env.NODE_ENV.startsWith('p')) {
      return nodemailer.createTransport({
        host: 'smtp-relay.brevo.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.BREVO_LOGIN, // your Brevo login (usually your email)
          pass: process.env.BREVO_PASSWORD, // your Brevo SMTP password
        },
      });
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.USERNAME_EMAIL,
        pass: process.env.PASSWORD_EMAIL,
      },
    });
  }

  //SEND THE ACTUAL EMAIL
  async send(template, subject) {
    try {
      const html = pug.renderFile(
        `${__dirname}/../views/email/${template}.pug`,
        {
          firstName: this.firstName,
          url: this.url,
          subject,
        },
      );

      const emailOptions = {
        from: this.from,
        to: this.to,
        subject,
        html,
        text: htmlToText(html),
      };

      await this.newTransport().sendMail(emailOptions);
    } catch (err) {
      console.error('❌ Error sending email:', err);
    }
  }

  async sendWelcome() {
    await this.send('Welcome', 'Welcome to the Natours family');
  }

  async sendPasswordReset() {
    await this.send('passwordReset', 'Password Reset Link');
  }
};
