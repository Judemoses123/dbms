const Sequelize = require("sequelize");
const UserTableMeta = require("../models/userTableMeta");

const sequelize = require("../utils/database");

const User = require("../models/user");

exports.createTable = async (req, res, next) => {
  console.log(req.body);
  try {
    const newTableMeta = await UserTableMeta.create({
      tableName: req.body.tableName,
    });

    const fieldNames = req.body.fieldNames;
    const dataTypes = req.body.dataTypes;
    const userFields = {};

    for (let i = 0; i < fieldNames.length; i++) {
      const fieldName = fieldNames[i];
      const dataType = dataTypes[i];

      const javascriptType = mapToJavascriptType(dataType);

      userFields[fieldName] = {
        type: javascriptType,
      };
    }

    const modelFields = {};
    Object.keys(userFields).forEach((fieldName) => {
      modelFields[fieldName] = {
        type: userFields[fieldName].type,
      };

      if (fieldName === "id") {
        modelFields[fieldName].primaryKey = true;
        modelFields[fieldName].autoIncrement = true;
      }
    });

    const UserTable = sequelize.define(newTableMeta.tableName, modelFields, {
      freezeTableName: true,
    });

    UserTableMeta.hasMany(UserTable, { foreignKey: "metaID" });

    await sequelize.sync();

    const tableFields = await sequelize
      .getQueryInterface()
      .describeTable(req.body.tableName);

    const tableData = await UserTable.findAll();

    res.status(201).json({
      message: "Table created successfully",
      fields: tableFields,
      data: tableData,
      id: newTableMeta.id,
    });
  } catch (error) {
    console.error("Error creating table:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getTable = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    const tableMeta = await UserTableMeta.findOne({ where: { id } });

    console.log(tableMeta.toJSON());
    if (!tableMeta) {
      return res.status(404).json({ message: "Table not found" });
    }

    const tableFields = await sequelize
      .getQueryInterface()
      .describeTable(tableMeta.tableName);

    const fieldList = Object.keys(tableFields);

    const modelFields = {};
    for (let i = 0; i < fieldList.length; i++) {
      if (
        fieldList[i] === "id" ||
        fieldList[i] === "createdAt" ||
        fieldList[i] === "updatedAt"
      )
        continue;
      modelFields[fieldList[i]] = {
        type:
          tableFields[fieldList[i]].type === "VARCHAR(255)"
            ? Sequelize.STRING
            : Sequelize.INTEGER,
      };
    }
    console.log(modelFields);
    const UserTable = sequelize.define(tableMeta.tableName, modelFields, {
      freezeTableName: true,
    });

    await sequelize.sync();

    const tableData = await UserTable.findAll();

    res.status(200).json({ fields: tableFields, data: tableData });
  } catch (error) {
    console.error("Error retrieving data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.postTable = async (req, res, next) => {
  console.log(req.body);
  const id = req.params.id;

  try {
    const tableMeta = await UserTableMeta.findOne({ where: { id } });

    if (!tableMeta) {
      return res.status(404).json({ message: "Table not found" });
    }
    const tableFields = await sequelize
      .getQueryInterface()
      .describeTable(tableMeta.tableName);

    const fieldList = Object.keys(tableFields);

    const modelFields = {};
    for (let i = 0; i < fieldList.length; i++) {
      if (
        fieldList[i] === "id" ||
        fieldList[i] === "createdAt" ||
        fieldList[i] === "updatedAt"
      )
        continue;
      modelFields[fieldList[i]] = {
        type:
          tableFields[fieldList[i]].type === "VARCHAR(255)"
            ? Sequelize.STRING
            : Sequelize.INTEGER,
      };
    }
    console.log(modelFields);

    const UserTable = sequelize.define(tableMeta.tableName, modelFields, {
      freezeTableName: true,
    });

    await sequelize.sync();

    const keys = Object.keys(tableFields);

    const data = {};
    for (let i = 0; i < keys.length - 3; i++) {
      data[keys[i]] = req.body[keys[i]];
    }

    // const k = UserTable.build(data);
    // console.log(k);
    // k.save();
    const response = await UserTable.create(data);
    console.log(response);

    res.status(200).json({ message: "succesfully added to table" });
  } catch (error) {
    console.error("Error creating record:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getTables = async (req, res, next) => {
  try {
    const tablesMeta = await UserTableMeta.findAll();
    if (!tablesMeta) {
      return res.status(404).json({ message: "fetching Table Failed" });
    }
    res.status(200).json({ tables: tablesMeta });
  } catch (error) {
    console.error("Error retrieving data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

function mapToJavascriptType(userDataType) {
  switch (userDataType.toUpperCase()) {
    case "STRING":
      return Sequelize.STRING;
    case "NUMBER":
      return Sequelize.INTEGER;
    default:
      return Sequelize.STRING;
  }
}
