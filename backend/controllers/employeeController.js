const db = require("../config/db");
const bcrypt = require("bcryptjs");

const createEmployee = async (req, res) => {
  try {
    // get employee and employee services from request body [frontend]
    const { employee, services } = req.body;
    // hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(employee.password, salt);
    employee.password = hashedPassword;
    const query = "INSERT INTO Employee SET ?";
    let error = false;
    // execute query to create employee
    db.query(query, employee, (err, result) => {
      if (err) {
        error = err;
        return;
      }
      db.query(
        "SELECT * from Employee WHERE email = ?",
        [employee.email],
        (err, results) => {
          if (err) {
            error = err;
            return;
          }
          let employeeId = results[0]?.id;
          // add employeeService entries
          // construct an array of arrays of the [employeeId, serviceId] in this order
          // mysql will parse this into multiple insert statements
          const employeeServices = services.map((service) => {
            return [employeeId, service.id];
          });
          console.log(employeeServices);
          // wrap the array of arrays in another array brackets so this will be [[[employeeId, serviceId], [employeeId, serviceId]]]
          // this will allow Mysql to insert every single employeeService
          const serviceQuery =
            "INSERT INTO EmployeeService (employeeId, serviceId) VALUES ?";
          db.query(serviceQuery, [employeeServices], (err, result) => {
            if (err) {
              error = err;
            }
            res.status(200).json({
              success: true,
              message: "Employee Created Successfully",
            });
          });
        }
      );
    });
    if (error) throw new Error(error.message);

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
