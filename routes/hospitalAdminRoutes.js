const express = require("express");
const router = express.Router();
const {
  addStaffAccount,
  deleteStaffAccount,
  viewPatientsByHospital,
  updateStaffAccount,
  getStaff,
} = require("../controllers/hospitalAdminController");
const authMiddleware = require("../middleware/authmiddleware");

router.route('/')
  .get(authMiddleware, getStaff)
  .post(authMiddleware, addStaffAccount);

router.route('/:id')
  .put(authMiddleware, updateStaffAccount);


router.delete("/staff/:staffId", authMiddleware, deleteStaffAccount);

router.get("/patients/:hospitalID", authMiddleware, viewPatientsByHospital);

module.exports = router;
