const express = require("express");
const router = express.Router();
const { updateMedicalRecord } = require("../controllers/triageController");
const authMiddleware = require("../middleware/authmiddleware");

router.put("/update/:medicalRecordId", authMiddleware, updateMedicalRecord);

module.exports = router;
