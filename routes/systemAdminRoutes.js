const express = require("express");

const {
  viewAllRecords,
  registerHospital,
  deleteHospital,
} = require("../controllers/systemAdminContoller");
const authMiddleware = require("../middleware/authmiddleware");

const app = express();

app.get("/all-records", authMiddleware, viewAllRecords);
app.post("/register-hospital", authMiddleware, registerHospital);
app.delete("/delete-hospital", authMiddleware, deleteHospital);

module.exports = app;
