const express = require("express");

const tableController = require("../controllers/table");

const router = express.Router();

router.post("/createTable", tableController.createTable);
router.get("/getTable/", tableController.getData);

module.exports = router;
