const express = require("express");

const tableController = require("../controllers/table");

const router = express.Router();

router.post("/createTable", tableController.createTable);

router.post("/addData/:id", tableController.postTable);

router.get("/getTables", tableController.getTables);

router.get("/getTable/:id", tableController.getTable);

module.exports = router;
