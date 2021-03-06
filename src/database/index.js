import Sequelize from 'sequelize';

import postgres from '../config/postgres';

import User from '../app/models/User';
import Collection from '../app/models/Collection';
import Note from '../app/models/Note';

const models = [User, Collection, Note];

class Database {
  constructor() {
    this.postgres();
  }

  postgres() {
    this.connection = new Sequelize(postgres);

    models
      .map((model) => model.init(this.connection))
      .map(
        (model) => model.associate && model.associate(this.connection.models)
      );
  }
}

export default new Database();
