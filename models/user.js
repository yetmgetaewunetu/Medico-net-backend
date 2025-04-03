const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['Admin', 'HospitalAdministrator', 'Receptionist', 'Doctor', 'Triage', 'LabTechnician', 'Pharmacist'], required: true }
}, { discriminatorKey: 'role' });

const User = mongoose.model('User', userSchema);
module.exports = User;