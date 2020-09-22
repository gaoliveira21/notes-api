import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import authConfig from '../../config/auth';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password_hash: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_reset_token: Sequelize.STRING,
        password_reset_expires: Sequelize.DATE,
      },
      { sequelize }
    );

    this.addHook('beforeSave', async (user) => {
      if (user.password)
        user.password_hash = await bcrypt.hash(user.password, 8);
    });

    return this;
  }

  generateAuthToken() {
    const { id } = this;
    return jwt.sign({ id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });
  }

  comparePassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }

  response() {
    const { id, name, email } = this;
    return { id, name, email };
  }

  static associate(models) {
    this.hasMany(models.Collection, {
      foreignKey: 'user_id',
      as: 'collections',
    });
  }
}

export default User;
