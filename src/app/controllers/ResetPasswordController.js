import User from '../models/User';

class ResetPasswordController {
  async store(request, response) {
    const { email, password, token } = request.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return response.status(404).json({ error: 'User not found' });
    }

    if (token !== user.password_reset_token) {
      return response.status(400).json({ error: 'Token invalid' });
    }

    const now = new Date();

    if (now > user.password_reset_expires) {
      return response
        .status(400)
        .json({ error: 'Token expired, generate a new token' });
    }

    user.password = password;
    user.save();

    return response.status(204).json();
  }
}

export default new ResetPasswordController();
