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
     SELECT C.name, B.address, B.id as branchId FROM Company C JOIN Branch B on B.companyId = C.id WHERE C.name LIKE ?
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

    // if (longitude && latitude) {
    //   const userLocation = {
    //     latitude: parseFloat(latitude),
    //     longitude: parseFloat(longitude),
    //   };
    //   results = results.filter((company) =>
    //     isLocationWithinRadius(
    //       parseFloat(company.branchLatitude),
    //       parseFloat(company.branchLongitude),
    //       30,
    //       userLocation.latitude,
    //       userLocation.longitude
    //     )
    //   );
    //   // Sort companies by distance
    //   results.sort((a, b) => {
    //     const distanceA = calculateDistance(userLocation, {
    //       latitude: parseFloat(a.branchLatitude),
    //       longitude: parseFloat(a.branchLongitude),
    //     });
    //     const distanceB = calculateDistance(userLocation, {
    //       latitude: parseFloat(b.branchLatitude),
    //       longitude: parseFloat(b.branchLongitude),
    //     });
    //     return distanceA - distanceB;
    //   });
    // }

    for (let i = 0; i < results.length; i++) {
      if (results[i].homePic) {
        // convert the binary data to a base64-encoded string
        const base64Image = results[i].homePic.toString();
        results[i].homePic = base64Image;
      }

      const servicesQuery =
        "SELECT S.id AS id, CS.price AS price, CS.length AS length, S.name AS name, S.description AS description FROM CompanyService CS JOIN Service S ON S.id = CS.serviceId WHERE CS.companyId = ?;";
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
const Moment = require("moment-timezone");
const MomentRange = require("moment-range");
const moment = MomentRange.extendMoment(Moment);
const getAvailableSlots = async (req, res) => {
  const { service, employeeId, companyId, branchId, selectedDate } = req.query;

  const conn = await db.awaitGetConnection();

  try {
    // Get the company's business hours
    const [company] = await conn.awaitQuery(
      "SELECT mondayStart, mondayEnd, tuesdayStart, tuesdayEnd, wednesdayStart, wednesdayEnd, thursdayStart, thursdayEnd, fridayStart, fridayEnd, saturdayStart, saturdayEnd, sundayStart, sundayEnd FROM Company WHERE id = ?",
      [companyId]
    );

    // Get all the booked slots for the given date and branch
    const selDate = moment(selectedDate).toISOString().slice(0, 10);
    console.log("seldate", selDate);
    let bookedSlots = [];
    if (employeeId) {
      bookedSlots = await conn.awaitQuery(
        "SELECT startTime, endTime FROM Bookings WHERE branchId = ? AND employeeId = ? AND date = ?",
        [branchId, employeeId, selDate]
      );
    } else {
      bookedSlots = await conn.awaitQuery(
        "SELECT startTime, endTime FROM Bookings WHERE branchId = ? AND date = ?",
        [branchId, selDate]
      );
    }
    console.log("booked slots", bookedSlots);

    // Convert the booked slots to an array of moment ranges
    const bookedRanges = bookedSlots.map((slot) => {
      const start = moment.tz(
        `${selDate} ${slot.startTime}`,
        "YYYY-MM-DD HH:mm:ss",
        "UTC"
      );
      const end = moment.tz(
        `${selDate} ${slot.endTime}`,
        "YYYY-MM-DD HH:mm:ss",
        "UTC"
      );
      return moment.range(start, end);
    });

    // Determine the start and end times for the given date based on the company's business hours
    const dayOfWeek = moment(selDate).day();
    const startTime = moment.tz(
      `${selDate} ${
        company[`${moment.weekdays(dayOfWeek).toLowerCase()}Start`]
      }`,
      "YYYY-MM-DD HH:mm:ss",
      "UTC"
    );
    const endTime = moment.tz(
      `${selDate} ${company[`${moment.weekdays(dayOfWeek).toLowerCase()}End`]}`,
      "YYYY-MM-DD HH:mm:ss",
      "UTC"
    );
    console.log("hours", startTime, endTime);
    // Generate all the available slots for the given date and branch
    const serviceLength = moment.duration(service.length).as("minutes");
    const availableSlots = [];
    let currentTime = startTime.clone();
    while (currentTime.isBefore(endTime)) {
      // Check if the current time falls within the business hours

      const isWithinBusinessHours = currentTime.isBetween(
        startTime,
        endTime,
        null,
        "[]"
      );

      // Check if the current slot is available
      const slotStart = currentTime.clone();
      const slotEnd = currentTime.clone().add(serviceLength, "minutes");
      const slotRange = moment.range(slotStart, slotEnd);

      const isAvailable = !bookedRanges.some((bookedRange) =>
        bookedRange.overlaps(slotRange)
      );

      // Add the current slot to the list of available slots
      if (isWithinBusinessHours && isAvailable) {
        availableSlots.push([
          slotStart.format("HH:mm:ss"),
          slotEnd.format("HH:mm:ss"),
        ]);
      }

      // Increment the current time by the length of the service
      currentTime.add(serviceLength, "minutes");
    }
    console.log("avail", availableSlots);
    res.status(200).json({ availableSlots });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error getting search results" });
  } finally {
    conn.release();
  }
};
module.exports = {
  getTopCompanies,
  getAutoComplete,
  searchService,
  getAvailableSlots,
};
