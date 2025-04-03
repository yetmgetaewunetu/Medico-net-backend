const express = require("express");

const { registerPatient } = require("../controllers/receptionistController");

const app = express();

app.post("/register-patient", registerPatient);

module.exports = app;
