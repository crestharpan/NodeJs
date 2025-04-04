const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const pug = require('pug');
const htmlToText = require('html-to-text');

dotenv.config({ path: '../config.env' });

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Arpan Shrestha <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      return 1;
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
    //1) RENDER THE HTML BASED ON THE PUG TEMPLATE
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });

    //2) DEFINE THE EMAIL OPTIONS
    const emailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText(html, {
        wordwrap: false,
      }),
    };
    //3) CREATE A TRANSPORT AND SEND THE EMAIL
    await this.newTransport().sendEmail(emailOptions);
  }

  async sendWelcome() {
    await this.sendEmail('Welcome', 'Welcome to the Natours family');
  }
};
