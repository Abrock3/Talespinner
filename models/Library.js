const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Library extends Model {
// methods for users
}

Library.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      default: "Untitled Story"
    },
    story: {
      type: DataTypes.STRING(16000),
      allowNull: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'user',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'library',
  }
);

module.exports = Library;