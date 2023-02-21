const express = require("express");
const router = express.Router();
const {
  addCompanyService,
  getCompanyServices,
} = require("../controllers/companyServiceController");
router.post("/", addCompanyService);
router.get("/", getCompanyServices);
module.exports = router;
