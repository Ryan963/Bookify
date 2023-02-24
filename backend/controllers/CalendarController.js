const getCalendar = async (req, res) => {
  try {
    res.status(200).json({ data: [{ serviceName: "Haircut", employeeName: "John", startTime: "12:00:00", endTime: "12:30:00", date: "2023-02-22" }] });
  } catch (error) {}
};

module.exports = { getCalendar };
