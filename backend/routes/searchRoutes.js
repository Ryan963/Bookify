const express = require("express");
const router = express.Router();
const {
  getTopCompanies,
  getAutoComplete,
  searchService,
} = require("../controllers/searchController");
router.get("/recommend", getTopCompanies);
router.get("/autoComplete", getAutoComplete);
router.get("/", searchService);
module.exports = router;
