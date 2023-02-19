const db = require("../config/db");

const addBranch = async (req, res) => {
  try {
    const connection = await db.awaitGetConnection();
    connection.on(`error`, (err) => {
      console.error(`Connection error ${err.code}`);
    });
    const { branch } = req.body;
    const query = "INSERT INTO Branch SET ?";
    await connection.awaitQuery(query, branch);
    connection.release();
    res.status(200).json({
      success: true,
      message: "Branch Created Successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  addBranch,
};
