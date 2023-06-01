const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    static associate(models) {
      Message.belongsTo(models.User, { 
        foreignKey: 'userId',
        allowNull:false
      });
    }
  }

  Message.init(
    {
      userId: DataTypes.INTEGER,
      title: DataTypes.STRING,
      content: DataTypes.STRING,
      attachment: DataTypes.STRING,
      likes: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Message',
    }
  );

  return Message;
};
