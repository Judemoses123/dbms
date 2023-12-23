const Sequelize = require("sequelize");
const sequelize = require("../utils/database");
const Table = require("../models/table");
const models = [];
exports.createTable = async (req, res, next) => {
  try {
    const tableName = req.body.tableName;
    const fieldName = req.body.fieldName;
    const dataType = req.body.dataType;

    let sequelizeDataType;
    if (dataType === "STRING") {
      sequelizeDataType = Sequelize.STRING;
    } else if (dataType === "NUMBER") {
      sequelizeDataType = Sequelize.INTEGER;
    } else {
      return res
        .status(400)
        .send("Invalid data type. Supported types are STRING and NUMBER.");
    }

    const modelAttributes = {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      [fieldName]: {
        type: sequelizeDataType,
        allowNull: true,
      },
    };
    const dynamicModel = sequelize.define(tableName, modelAttributes);
    models.push({ tableName: dynamicModel });
    await sequelize.sync();
    console.log(models);
    res.send("Table created successfully");
  } catch (error) {
    console.error("Error creating table:", error);
    res.status(500).send("Internal Server Error");
  }
};

exports.getData = async (req, res, next) => {
  try {
    const tableName = req.params.tableName;
    Table.findAll()
      .then(data=>{
        console.log(data);
        res.send(data);
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {
    console.log(error);
  }
};
