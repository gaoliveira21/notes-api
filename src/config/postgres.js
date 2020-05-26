require('dotenv');

const {
  POSTGRES_HOST,
  POSTGRES_USER,
  POSTGRES_PASS,
  POSTGRES_DBNAME,
} = process.env;

module.exports = {
  dialect: 'postgres',
  host: POSTGRES_HOST,
  username: POSTGRES_USER,
  password: POSTGRES_PASS,
  database: POSTGRES_DBNAME,
  define: {
    timestamp: true,
    underscored: true,
    underscoredAll: true,
  },
};
