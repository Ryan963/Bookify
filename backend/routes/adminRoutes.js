const express = require("express");
const router = express.Router();
const {
  registerAdmin,
  loginAdmin,
  approveCompany,
  deleteCompany,
} = require("../controllers/adminController");

router.post("/login", loginAdmin);
router.post("/", registerAdmin);
router.put("/approve", approveCompany);

module.exports = router;
