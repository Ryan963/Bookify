const express = require("express");
const router = express.Router();
const {
  registerAdmin,
  loginAdmin,
  approveCompany,
} = require("../controllers/adminController");

router.post("/login", loginAdmin);
router.post("/", registerAdmin);
router.put("/approve", approveCompany);
module.exports = router;
