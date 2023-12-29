const Sequelize = require("sequelize");

const sequelize = require("../utils/database");

const UserTableMeta = sequelize.define("UserTableMeta", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  tableName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = UserTableMeta;
