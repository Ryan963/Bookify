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

const getCompanyServices = async (req, res) => {
  try {
    const connection = await db.awaitGetConnection();
    connection.on(`error`, (err) => {
      console.error(`Connection error ${err.code}`);
    });
    const { companyId } = req.query;
    const query =
      "SELECT CS.id as id, CS.price as price, CS.length as length, C.name as name, C.description as description FROM CompanyService CS JOIN Service C on CS.serviceId = C.id  WHERE companyId = ?";
    const results = await connection.awaitQuery(query, [companyId]);
    connection.release();
    res.status(200).json({ success: true, services: results });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  addCompanyService,
  getCompanyServices,
};
