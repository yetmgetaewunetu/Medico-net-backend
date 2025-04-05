const express = require("express");

const {
  viewAllRecords,
  registerHospital,
  deleteHospital,
  addHospitalAdmin,
  getAllHospitals,
  getHospitalDetail,
  updateHospital,
  getHospitalAdmin,
  updateHospitalAdmin,
  deleteHospitalAdmin,
  getPatient
} = require("../controllers/systemAdminContoller");
const authMiddleware = require("../middleware/authmiddleware");
 

const router = express();

router.get("/all-records", authMiddleware, viewAllRecords);
router.get("/all-patient", authMiddleware, getPatient);
router.post("/register-hospital", authMiddleware, registerHospital);

router.delete("/delete-hospital/:id", authMiddleware, deleteHospital);
router.post("/register-hospitalAdmin", authMiddleware, addHospitalAdmin);
router.get("/get-hospitals", authMiddleware, getAllHospitals);

// Hospital routes
router.get('/get-hospitalDetail/:id', authMiddleware, getHospitalDetail);
router.put('/update-hospital/:id', authMiddleware, updateHospital);

// Hospital Admin routes
router.get('/hospitals/:hospitalId/admins', authMiddleware, getHospitalAdmin);
router.post('/update-hospitalAdmin/:id', authMiddleware, updateHospitalAdmin);
router.delete('/delete-hospitalAdmin/:id', authMiddleware, deleteHospitalAdmin);



module.exports = router;
