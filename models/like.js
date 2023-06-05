const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Like extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Like.belongsTo(models.User, { 
        foreignKey: 'userId',
        allowNull:false
      });
      Like.belongsTo(models.Message, { 
        foreignKey: 'messageId',
        allowNull:false
      });
      
     //////////////////////////////////
     models.Message.belongsToMany(models.user, { 
        through:Like,
        foreignKey: 'messageId',
        otherKey:'userId'
      });
      models.user.belongsToMany(models.Message, { 
        through:Like,
        foreignKey: 'userId',
        otherKey:'messageId'
      });
    }
  }
  Like.init({
    messageId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Like',
  });
  return Like;
};