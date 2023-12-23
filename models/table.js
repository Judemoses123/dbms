const Sequelize = require("sequelize");
const sequelize = require("../utils/database");

const Table = sequelize.define("table", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  tableName: Sequelize.STRING,
});

module.exports = Table;
