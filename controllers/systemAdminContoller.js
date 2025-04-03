const Pharmacist = require('../models/Pharmacist.js');
const LabTechnician = require('../models/LabTechnician.js');
const triage = require('../models/Triage.js');
const doctor = require('../models/Doctor.js');
const Patient = require('../models/Patient.js');
const HospitalAdministrator = require('../models/HospitalAdministrator.js');
const Hospital = require('../models/Hospital.js');

const registerHospital = async (req,res) => {
    try {

        // Check if hospital with same license number already exists
        const hospitalData = req.body;


        const existingHospital = await Hospital.findOne({ licenseNumber: hospitalData.licenseNumber });
        if (existingHospital) {
            throw new Error('Hospital with this license number already exists');
        }

        const hospital = new Hospital({
            name: hospitalData.name,
            location: hospitalData.location,
            contactNumber: hospitalData.contactNumber,
            licenseImage: hospitalData.licenseImage,
            licenseNumber: hospitalData.licenseNumber
        });

        const savedHospital = await hospital.save();
        res.status(201).json({hospital});
    } catch (error) {
        console.error('Error registering hospital:', error);
        res.status(501).json({msg: "internal server error"})
    }
};

const deleteHospital = async (req,res) => {
    try {
        const {hospitalId} = req.body

        if (!mongoose.Types.ObjectId.isValid(hospitalId)) {
            throw new Error('Invalid hospital ID format');
        }

        const deletedHospital = await Hospital.findByIdAndDelete(hospitalId);
        
        if (!deletedHospital) {
            throw new Error('Hospital not found');
        }

        await HospitalAdministrator.deleteMany({hospitalId});
        await doctor.deleteMany({hospitalId});
        await Pharmacist.deleteMany({hospitalId});
        await LabTechnician.deleteMany({hospitalId});
        await triage.deleteMany({hospitalId});

        return deletedHospital;

    } catch (error) {
        console.error('Error deleting hospital:', error);
        throw error;
    }
};

const viewAllRecords = async (req,res) =>{
    try {
        const data = await Patient.find({});

        res.status(200).json({data})

    } catch (error) {
        console.log("Error at VIEW ALL RECORDS(SYSTEM ADMIN.JS", error.js);
    }
}



module.exports = {deleteHospital, registerHospital,viewAllRecords};