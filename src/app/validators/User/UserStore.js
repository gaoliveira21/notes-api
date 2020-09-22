import * as yup from 'yup';

export default async (request, response, next) => {
  try {
    const schema = yup.object().shape({
      name: yup.string().required(),
      email: yup.string().email().required(),
      password: yup.string().min(6).max(25).required(),
    });

    await schema.validate(request.body, { abortEarly: false });

    return next();
  } catch (error) {
    return response.status(400).json({
      error: 'Validation Fails',
      messages: error.inner,
    });
  }
};
