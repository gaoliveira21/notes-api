import Sequelize from 'sequelize';

import postgres from '../config/postgres';

class Database {
  constructor() {
    this.postgres();
  }

  postgres() {
    this.connection = new Sequelize(postgres);
  }
}

export default new Database();
