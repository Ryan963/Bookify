const db = require("../config/db");
const fs = require("fs");
const { convertTo24Hour } = require("../helpers/convert-time");
const dayArray = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];
const createCompany = async (req, res) => {
  const homePic = req.file.path;
  try {
    // get company and company services from request body [frontend]
    const connection = await db.awaitGetConnection();

    connection.on(`error`, (err) => {
      console.error(`Connection error ${err.code}`);
    });
    const company = req.body;

    for (let day of dayArray) {
      company[`${day}Start`] = convertTo24Hour(company[`${day}Start`]);
      company[`${day}End`] = convertTo24Hour(company[`${day}End`]);
    }
    company.homePic = homePic;
    company.approved = false;
    console.log(company);
    const query = "INSERT INTO Company SET ?";

    // execute query to create company
    const companyInserted = await connection.awaitQuery(query, company);

    connection.release();
    res.status(200).json({
      success: true,
      message: "Company Created Successfully",
    });
    //
  } catch (error) {
    console.log(error);
    fs.unlink(homePic, (err) => {
      if (err) {
        console.error(err);
      }
    });
    res.status(500).json({ message: error.message });
  }
};

const updateCompany = async (req, res) => {
  try {
    const { updatedCompany } = req.body;
    const { id } = req.query;
    const updateCompanyTable = "UPDATE Company SET ? WHERE id = ?";
    // check if
    if (updatedCompany.email || updatedCompany.id || updatedCompany.password) {
      res.status(400).json({
        success: false,
        message: "Not allowed to update following parameter",
      });
    }
    const connection = await db.awaitGetConnection();
    connection.on(`error`, (err) => {
      console.error(`Connection error ${err.code}`);
    });

    const updatedCom = await connection.awaitQuery(updateCompanyTable, [
      updatedCompany,
      id,
    ]);
    console.log(updatedCom);

    res.status(200).json({
      success: true,
      message: "Company Updated Succesfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

//   Not necessary.
const delCompany = async (req, res) => {
  try {
    const { companyId } = req.query;
    const deleteCompanyFromTable = "DELETE FROM Company WHERE id = ?";
    const connection = await db.awaitGetConnection();
    connection.on(`error`, (err) => {
      console.error(`Connection error ${err.code}`);
    });
    const removedEmployee = await connection.awaitQuery(
      deleteCompanyFromTable,
      [companyId]
    );
    res.status(200).json({
      success: true,
      message: "Company Removed Succesfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const getnotApprovedCompanies = async (req, res) => {
  //get approved companies

  try {
    const connection = await db.awaitGetConnection();

    connection.on(`error`, (err) => {
      console.error(`Connection error ${err.code}`);
    });

    const query = "SELECT * FROM Company"; // query for all companies
    const companies = await connection.awaitQuery(query); // create the connection
    connection.release(); // releases it

    res.status(200).json({
      //response status
      success: true,
      companies: companies,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createCompany,
  delCompany,
  getnotApprovedCompanies,
  updateCompany,
};
