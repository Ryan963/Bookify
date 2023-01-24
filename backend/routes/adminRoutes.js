const express = require("express");
const router = express.Router();
const {
  registerAdmin,
  loginAdmin,
  getMe,
} = require("../controllers/adminController");

router.post("/login", loginAdmin);
router.post("/", registerAdmin);

module.exports = router;