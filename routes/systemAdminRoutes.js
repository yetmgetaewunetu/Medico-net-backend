const express = require('express');

const {viewAllRecords,registerHospital,deleteHospital} = require('../controllers/systemAdminContoller');

const app = express()


app.get('/all-records',viewAllRecords)
app.post('/register-hospital',registerHospital)
app.delete('/delete-hospital',deleteHospital)

module.exports = app;