import User from '../models/User';

class SessionController {
  async store(request, response) {
    const { email, password } = request.body;

    const user = await User.findOne({
      where: {
        email,
      },
    });

    if (!user)
      return response
        .status(404)
        .json({ success: false, error: 'User not found' });

    if (!(await user.comparePassword(password)))
      return response
        .status(400)
        .json({ success: false, error: 'Password does not match' });

    return response.json({
      success: true,
      user: user.response(),
      token: user.generateAuthToken(),
    });
  }
}

export default new SessionController();
