const db = require("../config/db");
const bcrypt = require("bcryptjs");

const createEmployee = async (req, res) => {
  try {
    // get employee and employee services from request body [frontend]
    const connection = await db.awaitGetConnection();

    connection.on(`error`, (err) => {
      console.error(`Connection error ${err.code}`);
    });
    const { employee, services } = req.body;
    // hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(employee.password, salt);
    employee.password = hashedPassword;
    const query = "INSERT INTO Employee SET ?";
    // execute query to create employee
    const [employeeInserted] = await connection.awaitQuery(query, employee);

    const results = await connection.awaitQuery(
      "SELECT * from Employee WHERE email = ?",
      [employee.email]
    );

    let employeeId = results[0]?.id;
    // add employeeService entries
    // construct an array of arrays of the [employeeId, serviceId] in this order
    // mysql will parse this into multiple insert statements
    const employeeServices = services.map((service) => {
      return [employeeId, service.id];
    });
    // wrap the array of arrays in another array brackets so this will be [[[employeeId, serviceId], [employeeId, serviceId]]]
    // this will allow Mysql to insert every single employeeService
    const serviceQuery =
      "INSERT INTO EmployeeService (employeeId, serviceId) VALUES ?";
    const insertedServices = await connection.awaitQuery(serviceQuery, [
      employeeServices,
    ]);
    console.log(insertedServices);
    connection.release();
    res.status(200).json({
      success: true,
      message: "Employee Created Successfully",
    });
    //
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const delEmployee = (req, res) => {
  const { employeeId } = req.body;
};

module.exports = {
  createEmployee,
  delEmployee,
};
