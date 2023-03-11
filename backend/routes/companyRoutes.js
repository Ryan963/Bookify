/* add functionality to create comapny */
const express = require("express");
const multer = require("multer");

const fs = require("fs");
const path = require("path");

const imagesDirectory = path.join(__dirname, "..", "images");

if (!fs.existsSync(imagesDirectory)) {
  fs.mkdirSync(imagesDirectory);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now());
  },
});

const upload = multer({ storage });
const router = express.Router();
const {
  createCompany,
  delCompany,
  getnotApprovedCompanies,
  updateCompany,
  getCompanyByName,
} = require("../controllers/companyController");
router.post("/create", upload.single("homePic"), createCompany);
router.delete("/delete", delCompany);
router.put("/update", updateCompany);
router.get("/name", getCompanyByName);

router.get("/", getnotApprovedCompanies);
module.exports = router;
