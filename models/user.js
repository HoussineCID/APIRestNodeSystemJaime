const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Message, { foreignKey: 'userId' , allowNull:false });
    }

    //////////////default sequelize connait findOne findAll create update ......
    // static findOneByEmail(email) {
    //   return this.findOne({ where: { email } });
    // }
  }

  User.init(
    {
      email: DataTypes.STRING,
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      bio: DataTypes.STRING,
      isAdmin: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'User',
    }
  );

  return User;
};
