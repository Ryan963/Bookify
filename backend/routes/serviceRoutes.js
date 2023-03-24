const express = require("express");
const router = express.Router();
const {
  getServices,
  insertService,
} = require("../controllers/serviceController");
router.get("/", getServices);
router.post("/", insertService);
module.exports = router;
