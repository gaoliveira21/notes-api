import * as yup from 'yup';

export default async (request, response, next) => {
  try {
    const schema = yup.object().shape({
      email: yup.string().email().required(),
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
