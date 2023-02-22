const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const loginEmp = async (req, res) => {
  try {
    const { email, password } = req.body;
    const connection = await db.awaitGetConnection();
    connection.on(`error`, (err) => {
      console.error(`Connection error ${err.code}`);
    });
    const query = "SELECT * FROM Employee WHERE email = ?";
    let employee = await connection.awaitQuery(query, [email]);
    if (employee.length > 0) {
      employee = employee[0];
    } else {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }
    connection.release();
    // check if admin exists and compare passwords.
    if (
      employee &&
      employee.role === 3 &&
      (await bcrypt.compare(password, employee.password))
    ) {
      res.status(200).json({
        success: true,
        employee: employee,
        token: generateToken(employee.id),
      });
    } else if (
      employee &&
      employee.role === 1 &&
      (await bcrypt.compare(password, employee.password))
    ) {
      res.status(200).json({
        success: true,
        employee: employee,
        token: generateManagerToken(employee.id),
      });
    } else {
      res.status(400).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

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
    const employeeInserted = await connection.awaitQuery(query, employee);

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

const getEmployeesByCompany = async (req, res) => {
  try {
    const { companyId } = req.query;
    const getEmployeeFromCompany = "SELECT * FROM Employee WHERE companyId = ?";
    const connection = await db.awaitGetConnection();
    connection.on(`error`, (err) => {
      console.error(`Connection error ${err.code}`);
    });
    const results = await connection.awaitQuery(getEmployeeFromCompany, [
      companyId,
    ]);
    connection.release();
    res.status(200).json({
      success: true,
      employees: results,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const delEmployee = async (req, res) => {
  try {
    const { employeeId } = req.query;
    const deleteEmployeeFromTable =
      "UPDATE Employee SET current = 0 WHERE id = ? AND current = 1";
    const connection = await db.awaitGetConnection();
    connection.on(`error`, (err) => {
      console.error(`Connection error ${err.code}`);
    });
    const removedEmployee = await connection.awaitQuery(
      deleteEmployeeFromTable,
      [employeeId]
    );
    connection.release();
    res.status(200).json({
      success: true,
      message: "Employee Removed Succesfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const updateEmployeeTable = async (req, res) => {
  try {
    const { updatedEmployee } = req.body;
    const { employeeId } = req.query;
    const updateEmpTable = "UPDATE Employee SET ? where id = ?";

    if (
      updatedEmployee.email ||
      updatedEmployee.employeeId ||
      updatedEmployee.password
    ) {
      res.success(400).json({
        success: false,
        message: "Not allowed to update the following field",
      });
    }
    const connection = await db.awaitGetConnection();
    connection.on(`error`, (err) => {
      console.error(`Connection error ${err.code}`);
    });

    const updatedEmp = await connection.awaitQuery(updateEmpTable, [
      updatedEmployee,
      employeeId,
    ]);
    console.log(updatedEmp);
    connection.release();
    res.status(200).json({
      success: true,
      message: "Employee Updated Succesfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const getEmployeeByEmail = async (req, res) => {
  try {
    const connection = await db.awaitGetConnection();

    connection.on(`error`, (err) => {
      console.error(`Connection error ${err.code}`);
    });
    const { employeeEmail } = req.query;
    console.log(employeeEmail);
    const query = "SELECT * FROM Employee WHERE email = ?"; // query for all companies
    const employee = await connection.awaitQuery(query, [employeeEmail]); // create the connection
    connection.release(); // releases it

    res.status(200).json({
      //response status
      success: true,
      employee: employee[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_Employee_SECRET, {
    expiresIn: "12h",
  });
};

const generateManagerToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_EMPLOYEEADMIN_SECRET, {
    expiresIn: "12h",
  });
};

module.exports = {
  createEmployee,
  delEmployee,
  getEmployeesByCompany,
  updateEmployeeTable,
  loginEmp,
  getEmployeeByEmail,
};
