const express = require("express");
const router = express.Router();
const {
  addBranch,
  getBranchesByCompany,
} = require("../controllers/branchController");
router.post("/", addBranch);
router.get("/", getBranchesByCompany);

module.exports = router;
