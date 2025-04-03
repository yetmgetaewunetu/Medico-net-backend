const express = require('express');
const router = express.Router();
const { updateMedicalRecord } = require("../controllers/triageController");

router.put('/update/:medicalRecordId', updateMedicalRecord);

module.exports = router;