const db = require("../config/db");

const addCompanyService = async (req, res) => {
  try {
    const connection = await db.awaitGetConnection();

    connection.on(`error`, (err) => {
      console.error(`Connection error ${err.code}`);
    });

    const serviceQuery = "INSERT INTO CompanyService SET ?";
    const insertedCompServices = await connection.awaitQuery(
      serviceQuery,
      req.body
    );
    console.log(insertedCompServices);
    connection.release();
    res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addCompanyService,
};
