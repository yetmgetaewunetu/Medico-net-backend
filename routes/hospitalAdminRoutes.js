const express = require("express");
const router = express.Router();
const {
  addStaffAccount,
  deleteStaffAccount,
  viewPatientsByHospital,
} = require("../controllers/hospitalAdminController");
const authMiddleware = require("../middleware/authmiddleware");

router.post("/staff/add", authMiddleware, addStaffAccount);
router.delete("/staff/:staffId", authMiddleware, deleteStaffAccount);

router.get("/patients/:hospitalID", authMiddleware, viewPatientsByHospital);

module.exports = router;
