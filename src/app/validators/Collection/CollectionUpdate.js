import * as yup from 'yup';

export default async (request, response, next) => {
  try {
    const schema = yup.object().shape({
      title: yup.string(),
      color: yup
        .string()
        .matches(/^#[0-9A-F]{6}$/i, 'Color must be a valid hex color'),
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
