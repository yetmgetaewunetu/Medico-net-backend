const express = require("express");
const authMiddleware = require("../middleware/authmiddleware");
const {
  viewAssignedRecord,
  sendLabRequest,
  uploadRecord,
  sendPrescription,
} = require("../controllers/DoctorController");
const app = express();

app.get("/view-record/:faydaId", authMiddleware, viewAssignedRecord);

app.post("/request-lab", authMiddleware, sendLabRequest);

app.post("/upload-record", authMiddleware, uploadRecord);

app.post("/upload-prescription", authMiddleware, sendPrescription);

module.exports = app;
