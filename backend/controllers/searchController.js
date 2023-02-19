const db = require("../config/db");

const getTopCompanies = async (req, res) => {
  try {
    const connection = await db.awaitGetConnection();
    connection.on(`error`, (err) => {
      console.error(`Connection error ${err.code}`);
    });
    const { city } = req.body;
    // const query =
    //   "SELECT b.id AS branchId, COUNT(*) AS bookingCount, c.id AS companyId, c.name AS companyName FROM Branch b JOIN Company c ON b.companyId = c.id JOIN Bookings bk ON b.id = bk.branchId WHERE b.city = ? GROUP BY b.id ORDER BY bookingCount DESC LIMIT 10;";
    // **Temp Query until there is branches in the database
    // TODO: Fix this to use the actual query and edit it so it works
    const query =
      "SELECT id, name, number, email, homePic, description from Company";

    let results = await connection.awaitQuery(query);
    for (let i = 0; i < results.length; i++) {
      const servicesQuery = "SELECT * FROM CompanyService WHERE companyId = ?;";
      const services = await connection.awaitQuery(servicesQuery, [
        results[i].id,
      ]);
      results[i] = {
        ...results[i],
        services: services,
        address: "532 Sherwood Park NW",
      };
    }

    console.log(results);
    res.status(200).json({ success: true, branches: results });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const search = async (req, res) => {
  const { city, keyword } = req.query;
  const conn = await db.awaitGetConnection();

  try {
    const results = await conn.query(
      `
      SELECT b.id AS branchId, b.name AS branchName, c.id AS companyId, c.name AS companyName, 
      GROUP_CONCAT(DISTINCT s.name SEPARATOR ', ') AS serviceNames
      FROM Branch b
      JOIN Company c ON b.companyId = c.id
      LEFT JOIN CompanyService cs ON c.id = cs.companyId
      LEFT JOIN Service s ON cs.serviceId = s.id
      WHERE b.city = ?
      AND (b.name LIKE ? OR s.name LIKE ?)
      GROUP BY b.id, c.id
      ORDER BY COUNT(DISTINCT CASE WHEN b.name LIKE ? THEN b.id END) DESC, 
      COUNT(DISTINCT CASE WHEN s.name LIKE ? THEN b.id END) DESC
      LIMIT 10
    `,
      [
        `%${city}%`,
        `%${keyword}%`,
        `%${keyword}%`,
        `%${keyword}%`,
        `%${keyword}%`,
      ]
    );

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  } finally {
    conn.release();
  }
};

module.exports = {
  getTopCompanies,
  search,
};
