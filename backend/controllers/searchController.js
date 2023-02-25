const db = require("../config/db");
const fs = require("fs");
const {
  isLocationWithinRadius,
  calculateDistance,
} = require("../helpers/radius-checker");
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
      if (results[i].homePic) {
        // convert the binary data to a base64-encoded string
        const base64Image = results[i].homePic.toString();
        results[i].homePic = base64Image;
      }

      const servicesQuery =
        "SELECT CS.id AS id, CS.price AS price, CS.length AS length, S.name AS name, S.description AS description FROM CompanyService CS JOIN Service S ON S.id = CS.serviceId WHERE companyId = ?;";
      const services = await connection.awaitQuery(servicesQuery, [
        results[i].id,
      ]);
      results[i] = {
        ...results[i],
        services: services,
        address: "532 Sherwood Park NW",
      };
    }
    connection.release();
    res.status(200).json({ success: true, branches: results });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const getAutoComplete = async (req, res) => {
  // TODO: add the city in the query later on
  const { city, keyword } = req.query;
  const conn = await db.awaitGetConnection();

  try {
    const serviceResults = await conn.awaitQuery(
      `
     SELECT DISTINCT S.name FROM Service S WHERE S.name LIKE ? AND S.id IN (SELECT serviceId FROM CompanyService)
    `,
      [`%${keyword}%`]
    );

    const businessResults = await conn.awaitQuery(
      `
     SELECT DISTINCT C.name FROM Company C WHERE C.name LIKE ?
    `,
      [`%${keyword}%`]
    );
    res.status(200).json({
      success: true,
      results: { services: serviceResults, businesses: businessResults },
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  } finally {
    conn.release();
  }
};

const searchService = async (req, res) => {
  const { service, longitude, latitude } = req.query;
  const conn = await db.awaitGetConnection();
  try {
    let results = await conn.awaitQuery(
      `
      SELECT C.id AS id, C.name AS name, C.homePic AS homePic, C.description AS description, 
        B.id AS branchId, B.address AS branchAddress, B.city AS branchCity, B.province AS branchProvince,
        B.latitude AS branchLatitude, B.longitude AS branchLongitude
      FROM Company C
      JOIN Branch B ON C.id = B.companyId
      JOIN CompanyService CS ON C.id = CS.companyId
      WHERE CS.serviceId IN (SELECT id FROM Service WHERE name = ?)
    `,
      [service.name]
    );

    if (longitude && latitude) {
      const userLocation = {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      };
      results = results.filter((company) =>
        isLocationWithinRadius(
          parseFloat(company.branchLatitude),
          parseFloat(company.branchLongitude),
          30,
          userLocation.latitude,
          userLocation.longitude
        )
      );
      // Sort companies by distancexw
      results.sort((a, b) => {
        const distanceA = calculateDistance(userLocation, {
          latitude: parseFloat(a.branchLatitude),
          longitude: parseFloat(a.branchLongitude),
        });
        const distanceB = calculateDistance(userLocation, {
          latitude: parseFloat(a.branchLatitude),
          longitude: parseFloat(a.branchLongitude),
        });
        return distanceA - distanceB;
      });
    }

    for (let i = 0; i < results.length; i++) {
      if (results[i].homePic) {
        // convert the binary data to a base64-encoded string
        const base64Image = results[i].homePic.toString();
        results[i].homePic = base64Image;
      }

      const servicesQuery =
        "SELECT CS.id AS id, CS.price AS price, CS.length AS length, S.name AS name, S.description AS description FROM CompanyService CS JOIN Service S ON S.id = CS.serviceId WHERE CS.companyId = ?;";
      const services = await conn.awaitQuery(servicesQuery, [results[i].id]);
      results[i] = {
        ...results[i],
        services: services,
      };
    }

    res.status(200).json({ success: true, results });
  } catch (error) {
    console.error("Error getting search results:", error);
    res.status(500).json({ message: "Error getting search results" });
  } finally {
    conn.release();
  }
};

module.exports = {
  getTopCompanies,
  getAutoComplete,
  searchService,
};
