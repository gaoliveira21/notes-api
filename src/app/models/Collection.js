import Sequelize, { Model } from 'sequelize';

class Collection extends Model {
  static init(sequelize) {
    super.init(
      {
        title: Sequelize.STRING,
        color: Sequelize.STRING,
      },
      { sequelize }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'owner' });
    this.hasMany(models.Note, { foreignKey: 'collection_id', as: 'notes' });
  }
}

export default Collection;
