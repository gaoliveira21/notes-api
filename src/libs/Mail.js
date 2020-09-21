/* eslint-disable no-unused-expressions */
import nodemailer from 'nodemailer';
import nodemailerExpressHbs from 'nodemailer-express-handlebars';
import { resolve } from 'path';

import mailConfig from '../config/mail';

class Mail {
  constructor() {
    this.transporter;

    this.init();
  }

  init() {
    this.transporter = nodemailer.createTransport({
      secure: false,
      ...mailConfig,
    });
  }

  configureTemplates() {
    this.transporter.use(
      'compile',
      nodemailerExpressHbs({
        viewEngine: 'handlebars',
        viewPath: resolve(__dirname, '..', 'resources', 'mail'),
        extName: '.html',
      })
    );
  }

  sendMail(options) {
    return this.transporter.sendMail(options);
  }
}

export default new Mail();
