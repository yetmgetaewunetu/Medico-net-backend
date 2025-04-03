const express = require('express');
const router = express.Router();
const { addStaffAccount, deleteStaffAccount, viewPatientsByHospital } = require('../controllers/hospitalAdminController');



router.post('/staff/add', addStaffAccount);
router.delete('/staff/:staffId', deleteStaffAccount);


router.get('/patients/:hospitalID', viewPatientsByHospital);

module.exports = router;
