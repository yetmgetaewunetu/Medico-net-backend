const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const medicalRecordSchema = new Schema({
    faydaID: { type: String, required: true },
    patientID: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    doctorID: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    
    // General Measurements for Medical Record
    generalMeasurements: {
        bloodPressure: { type: String }, // Example: "120/80"
        heartRate: { type: Number }, // Example: 72 (bpm)
        weight: { type: Number }, // Example: 70 (kg)
        temperature: { type: Number } // Example: 36.5 (°C)
    },

    diagnosis: { type: String, required: true },
    prescriptions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Prescription' }],
    dateRecorded: { type: Date, default: Date.now }
});

const MedicalRecord = mongoose.model('MedicalRecord', medicalRecordSchema);
module.exports = MedicalRecord;
