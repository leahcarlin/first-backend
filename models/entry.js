"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class entry extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      entry.belongsTo(models.user, {
        through: "users",
        foreignKey: "userId",
      });
    }
  }
  entry.init(
    {
      content: { type: DataTypes.STRING, allowNull: false },
      gifUrl: { type: DataTypes.STRING, allowNull: false },
    },
    {
      sequelize,
      modelName: "entry",
    }
  );
  return entry;
};
