import crypto from 'crypto';
import User from '../models/User';

class ResetPasswordController {
  async store(request, response) {
    const { email } = request.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return response.status(404).json({ error: 'User not found' });
    }

    const token = crypto.randomBytes(20).toString('hex');

    const now = new Date();
    now.setHours(now.getHours() + 1);

    return response.json();
  }
}

export default new ResetPasswordController();
