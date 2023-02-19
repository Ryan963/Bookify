const express = require("express");
const router = express.Router();
const { getTopCompanies } = require("../controllers/searchController");
router.get("/recommend", getTopCompanies);
module.exports = router;
