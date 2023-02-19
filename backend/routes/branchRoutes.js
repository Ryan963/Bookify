const express = require("express");
const router = express.Router();
const { addBranch } = require("../controllers/branchController");
router.post("/add", addBranch);

module.exports = router;
