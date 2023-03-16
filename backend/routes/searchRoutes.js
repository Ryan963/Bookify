const express = require("express");
const router = express.Router();
const {
  getTopCompanies,
  getAutoComplete,
  searchService,
  getAvailableSlots,
} = require("../controllers/searchController");
router.get("/recommend", getTopCompanies);
router.get("/autoComplete", getAutoComplete);
router.get("/", searchService);
router.get("/slots", getAvailableSlots);
module.exports = router;
