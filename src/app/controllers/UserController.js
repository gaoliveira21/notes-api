import * as yup from 'yup';
import User from '../models/User';

class UserController {
  async store(request, response) {
    const schema = yup.object().shape({
      name: yup.string().required(),
      email: yup.string().email().required(),
      password: yup.string().min(6).max(25).required(),
    });

    await schema.validate(request.body).catch((err) =>
      response.status(400).json({
        success: false,
        error: err.name,
        details: err.errors,
      })
    );

    const { email, password, name } = request.body;

    const userExists = await User.findOne({
      where: { email },
    });

    if (userExists)
      return response.status(400).json({
        success: false,
        error: 'Unavailable email, this email already in use',
      });

    const user = await User.create({ email, password, name });

    return response.status(201).json({
      success: true,
      user: user.response(),
      token: user.generateAuthToken(),
    });
  }
}

export default new UserController();
