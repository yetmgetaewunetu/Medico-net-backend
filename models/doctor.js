const User = require('./User');
const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    hospitalID: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', required: true },
    contactNumber: { type: String, required: true },
    address: { type: String, required: true },
    specialization: { type: String } // Added as it's common for doctors
});

const Doctor = User.discriminator('Doctor', doctorSchema);
module.exports = Doctor;