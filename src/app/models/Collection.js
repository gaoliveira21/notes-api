import Sequelize, { Model } from 'sequelize';

class Collection extends Model {
  static init(sequelize) {
    super.init(
      {
        title: Sequelize.STRING,
      },
      { sequelize }
    );

    return this;
  }

  static associate(models) {
    return this.belongsTo(models.User, { foreignKey: 'user_id', as: 'owner' });
  }
}

export default Collection;
