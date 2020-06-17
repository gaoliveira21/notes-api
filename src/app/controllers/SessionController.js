import * as yup from 'yup';
import User from '../models/User';

class SessionController {
  async store(request, response) {
    const schema = yup.object().shape({
      email: yup.string().email().required(),
      password: yup.string().required(),
    });

    await schema.validate(request.body).catch((err) =>
      response.status(400).json({
        success: false,
        error: err.name,
        details: err.errors,
      })
    );

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
