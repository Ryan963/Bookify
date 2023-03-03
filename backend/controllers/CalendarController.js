const getCalendar = async (req, res) => {
  try {
    const data = [
      {
        serviceName: "Haircut",
        employeeName: "Filip",
        startTime: "12:00:00",
        endTime: "12:30:00",
        date: "2023-02-22",
      },
      {
        serviceName: "Haircut",
        employeeName: "john",
        startTime: "12:00:00",
        endTime: "12:30:00",
        date: "2023-02-23",
      },
      {
        serviceName: "Haircut",
        employeeName: "john",
        startTime: "12:00:00",
        endTime: "12:30:00",
        date: "2023-02-13",
      },
      {
        serviceName: "Haircut",
        employeeName: "john",
        startTime: "12:00:00",
        endTime: "12:30:00",
        date: "2023-02-01",
      },
    ];

    const convertedData = data.map((item, index) => {
      const startTime = new Date(`${item.date}T${item.startTime}`);
      const endTime = new Date(`${item.date}T${item.endTime}`);

      return {
        id: index + 1,
        title: `${item.serviceName} With ${item.employeeName}`,
        start: startTime,
        end: endTime,
        employee: item.employeeName,
      };
    });
    res.status(200).json({ data: convertedData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "SERVER ERROR" });
  }
};

module.exports = { getCalendar };
