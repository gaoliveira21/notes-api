const { AUTH_TOKEN_SECRET, AUTH_TOKEN_EXPIRES } = process.env;

export default {
  secret: AUTH_TOKEN_SECRET,
  expiresIn: AUTH_TOKEN_EXPIRES,
};
