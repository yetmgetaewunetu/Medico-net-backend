const express = require("express");

const { registerPatient } = require("../controllers/receptionistController");
const authMiddleware = require("../middleware/authmiddleware");

const app = express();

app.post("/register-patient", authMiddleware, registerPatient);

module.exports = app;
