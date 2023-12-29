const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");

const tableRoute = require("./routes/table");
const sequelize = require("./utils/database");

const User = require("./models/user");
const UserTableMeta = require("./models/userTableMeta");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

User.hasMany(UserTableMeta, { foreignKey: "userId" });

app.use(tableRoute);

sequelize
  // .sync({ force: true })
  .sync()
  .then((result) => {
    return User.findByPk(1);
  })
  .then((user) => {
    if (!user) {
      return User.create({
        id: 1,
        username: "judemoses",
        email: "judemoses123@gmail.com",
      });
    }
    return user;
  })
  .then((user) => {
    console.log(user);
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
