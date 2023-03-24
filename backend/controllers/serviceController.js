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

const insertService = async (req, res) => {
  const conn = await db.awaitGetConnection();
  try {
    const { service } = req.body;
    const query = "INSERT INTO Service set ?";
    const result = await conn.awaitQuery(query, service);
    res.status(200).json({ success: true, insertId: result.insertId });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  } finally {
    conn.release();
  }
};

module.exports = { getServices, insertService };
