const express = require("express");
const router = express.Router();
const {
  addCompanyService,
} = require("../controllers/companyServiceController");
router.post("/add", addCompanyService);

module.exports = router;
