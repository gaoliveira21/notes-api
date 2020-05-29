import Sequelize from 'sequelize';

import postgres from '../config/postgres';

import User from '../app/models/User';

const models = [User];

class Database {
  constructor() {
    this.postgres();
  }

  postgres() {
    this.connection = new Sequelize(postgres);

    models.map((model) => model.init(this.connection));
  }
}

export default new Database();
