import crypto from 'crypto';
import User from '../models/User';
import Mail from '../../libs/Mail';

class ForgotPasswordController {
  async store(request, response) {
    const { email } = request.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return response.status(404).json({ error: 'User not found' });
    }

    const token = crypto.randomBytes(20).toString('hex');

    const now = new Date();
    now.setHours(now.getHours() + 1);

    user.password_reset_token = token;
    user.password_reset_expires = now;
    user.save();

    await Mail.sendMail({
      to: email,
      from: 'admin@notes.com',
      subject: 'Recuperação de senha',
      html: '',
      template: 'auth/forgot_password',
      context: { token },
    });

    return response.status(201).json();
  }
}

export default new ForgotPasswordController();
