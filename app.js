const bodyParser = require("body-parser");
const express = require("express");

const tableRoute = require("./routes/table");
const sequelize = require("./utils/database");
const Table = require("./models/table");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use("/", tableRoute);

sequelize.sync();
app.listen(3000);
