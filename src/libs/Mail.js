/* eslint-disable no-unused-expressions */
import nodemailer from 'nodemailer';
import nodemailerExpressHbs from 'nodemailer-express-handlebars';
import expressHbs from 'express-handlebars';
import { resolve } from 'path';

import mailConfig from '../config/mail';

class Mail {
  constructor() {
    this.transporter;

    this.init();
    this.configureTemplates();
  }

  init() {
    this.transporter = nodemailer.createTransport({
      secure: false,
      ...mailConfig,
    });
  }

  configureTemplates() {
    const viewPath = resolve(__dirname, '..', 'resources', 'mail');

    this.transporter.use(
      'compile',
      nodemailerExpressHbs({
        viewEngine: expressHbs.create({
          layoutsDir: resolve(viewPath, 'layouts'),
          partialsDir: resolve(viewPath, 'partials'),
          defaultLayout: 'default',
          extname: '.hbs',
        }),
        viewPath,
        extName: '.hbs',
      })
    );
  }

  sendMail(options) {
    return this.transporter.sendMail(options);
  }
}

export default new Mail();
