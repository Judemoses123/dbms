const Sequelize = require("sequelize");

const sequelize = new Sequelize("main-schema", "root", "Ac123@quality", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
