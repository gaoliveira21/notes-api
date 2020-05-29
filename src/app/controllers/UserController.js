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

    return response.json();
  }
}

export default new UserController();
