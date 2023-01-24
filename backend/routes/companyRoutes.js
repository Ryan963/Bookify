/* add functionality to create comapny */
const express = require("express");
const router = express.Router();
const {
  createCompany,
  delCompany,
  getnotApprovedCompanies,
  updateCompany,
} = require("../controllers/companyController");
router.post("/create", createCompany);
router.delete("/delete", delCompany);
router.put("/update", updateCompany);

module.exports = router;

router.get("/", getnotApprovedCompanies);
