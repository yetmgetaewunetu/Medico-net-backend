const express = require("express");

const {
  viewAllRecords,
  registerHospital,
  deleteHospital,
  addHospitalAdmin,
} = require("../controllers/systemAdminContoller");
const authMiddleware = require("../middleware/authmiddleware");

const app = express();

app.get("/all-records", authMiddleware, viewAllRecords);
app.post("/register-hospital", authMiddleware, registerHospital);
app.delete("/delete-hospital", authMiddleware, deleteHospital);
app.post("/register-hospitalAdmin", authMiddleware, addHospitalAdmin);

module.exports = app;
