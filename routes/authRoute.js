const express = require("express");
const app = express();

const { login } = require("../controllers/userController");
const authMiddleware = require("../middleware/authmiddleware");

app.post("/login", login);

module.exports = app;
