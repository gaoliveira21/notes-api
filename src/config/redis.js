const { REDIS_HOST, REDIS_PORT } = process.env;

module.exports = {
  host: REDIS_HOST,
  port: REDIS_PORT,
};
