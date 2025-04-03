const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const patientSchema = new Schema({
    faydaID: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    contactNumber: { type: String, required: true },
    address: { type: String, required: true },
    emergencyContact: { type: String, required: true },
    medicalHistory: { type: String },
    registeredHospital: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital' }
});

const Patient = mongoose.model('Patient', patientSchema);
module.exports = Patient;