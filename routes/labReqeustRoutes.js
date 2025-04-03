const express = require('express');
const { updateLabRequest } = require('../controllers/labRequestController');
const router = express.Router();

router.put('/:labRequestId', updateLabRequest);


module.exports =router;