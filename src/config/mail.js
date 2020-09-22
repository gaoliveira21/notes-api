require('dotenv').config();

const { MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASS } = process.env;

module.exports = {
  host: MAIL_HOST,
  port: MAIL_PORT,
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASS,
  },
};
