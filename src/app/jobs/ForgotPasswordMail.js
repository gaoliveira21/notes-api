import Mail from '../../libs/Mail';

class ForgotPasswordMail {
  get key() {
    return 'ForgotPasswordMail';
  }

  async handle({ data }) {
    const { email, token } = data;

    await Mail.sendMail({
      to: email,
      from: 'admin@notes.com',
      subject: 'Recuperação de senha',
      html: '',
      template: 'auth/forgot_password',
      context: { token },
    });
  }
}

export default new ForgotPasswordMail();
