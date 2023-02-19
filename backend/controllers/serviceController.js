const db = require("../config/db");
const getServices = async (req, res) => {
  try {
    const getServicesQuery = "SELECT * FROM Service";
    const connection = await db.awaitGetConnection();
    connection.on(`error`, (err) => {
      console.error(`Connection error ${err.code}`);
    });
    const results = await connection.awaitQuery(getServicesQuery);
    connection.release();
    res.status(200).json({
      success: true,
      services: results,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getServices };
