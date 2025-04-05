const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Pharmacist = require("../models/Pharmacist.js");
const LabTechnician = require("../models/LabTechnician.js");
const triage = require("../models/Triage.js");
const doctor = require("../models/Doctor.js");
const Patient = require("../models/Patient.js");
const HospitalAdministrator = require("../models/HospitalAdministrator.js");
const Hospital = require("../models/Hospital.js");
const User = require("../models/User.js");
const Doctor = require("../models/Doctor.js");
const Triage = require("../models/Triage.js");
const Receptionist = require("../models/Receptionist.js");

const registerHospital = async (req, res) => {
  try {
    const { role } = req.user;
    if (role != "Admin") {
      return res.status(404).json({
        msg: "only admins can add a hospital",
      });
    }

    const hospitalData = req.body;

    const existingHospital = await Hospital.findOne({
      licenseNumber: hospitalData.licenseNumber,
    });
    if (existingHospital) {
      throw new Error("Hospital with this license number already exists");
    }

    const hospital = new Hospital({
      name: hospitalData.name,
      location: hospitalData.location,
      contactNumber: hospitalData.contactNumber,
      licenseImage: hospitalData.licenseImage,
      licenseNumber: hospitalData.licenseNumber,
    });

    const savedHospital = await hospital.save();
    res.status(201).json({ hospital });
  } catch (error) {
    console.error("Error registering hospital:", error);
    res.status(501).json({ msg: "internal server error" });
  }
};

const deleteHospital = async (req, res) => {
  try {
    const { role } = req.user;
    if (role !== "Admin") {
      return res.status(403).json({
        msg: "Only admins can delete hospitals",
      });
    }

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid hospital ID format" });
    }

    // Start transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // 1. First verify hospital exists
      const hospital = await Hospital.findById(id).session(session);
      if (!hospital) {
        await session.abortTransaction();
        return res.status(404).json({ msg: "Hospital not found" });
      }

      // 2. Delete all staff associated with this hospital
      await Promise.all([
        HospitalAdministrator.deleteMany({ hospitalID: id }).session(session),
        Doctor.deleteMany({ hospitalID: id }).session(session),
        Pharmacist.deleteMany({ hospitalID: id }).session(session),
        LabTechnician.deleteMany({ hospitalID: id }).session(session),
        Triage.deleteMany({ hospitalID: id }).session(session),
        Receptionist.deleteMany({ hospitalID: id }).session(session)
      ]);

      // 3. Finally delete the hospital
      await Hospital.findByIdAndDelete(id).session(session);

      await session.commitTransaction();
      
      return res.status(200).json({ 
        msg: "Hospital and all associated staff deleted successfully"
      });

    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }

  } catch (error) {
    console.error("Error deleting hospital:", error);
    return res.status(500).json({ 
      msg: error.message || "Internal server error" 
    });
  }
};

const viewAllRecords = async (req, res) => {
  try {
    const { role } = req.user;

    if (role != "Admin" || !role) {
      return res.status(404).json({
        msg: "only admins can view all records",
      });
    }

    const data = await Patient.find({});

    res.status(200).json({ data });
  } catch (error) {
    console.log("Error at VIEW ALL RECORDS(SYSTEM ADMIN.JS", error.message);
    res.status(500).json({ msg: "internal server error" });
  }
};


const getPatient = async (req, res ) => {
  try {
    const { role } = req.user;
    const { id } = req.params;

    if (role != "Admin" || !role) {
      return res.status(404).json({
        msg: "only admins can view all records",
      });
    }

    const data = await Patient.findOne({});

    res.status(200).json({ data });
  } catch (error) {
    console.log("Error at VIEW ALL RECORDS(SYSTEM ADMIN.JS", error.message);
    res.status(500).json({ msg: "internal server error" });
  }
};

const addHospitalAdmin = async (req, res) => {
  try {
    const { role } = req.user;
    
    if (role !== "Admin") {
      return res.status(403).json({
        msg: "Only admins can add hospital administrators"
      });
    }

    const userData = req.body;
    const {
      email,
      password,
      hospitalID,
      firstName,
      lastName,
      dateOfBirth,
      gender,
      phoneNumber
    } = userData;
    
    // Validate required fields
    if (!email || !password || !hospitalID || !firstName || !lastName || !dateOfBirth || !gender || !phoneNumber) {
      return res.status(400).json({ msg: "Please fill all required fields" });
    }

    // Check if hospital exists
    const hospital = await Hospital.findById(hospitalID);
    if (!hospital) {
      return res.status(404).json({ msg: "Hospital not found" });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User with this email already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    userData.password = await bcrypt.hash(password, salt);
    userData.role = "HospitalAdministrator";

    // Create new hospital admin
    const newHospitalAdmin = new HospitalAdministrator(userData);
    await newHospitalAdmin.save();

    // Initialize admins array if it doesn't exist
    if (!hospital.admins) {
      hospital.admins = [];
    }

    // Add admin to hospital's admins array
    hospital.admins.push(newHospitalAdmin._id);
    await hospital.save();

    res.status(201).json({
      msg: "Hospital administrator created successfully",
      admin: {
        _id: newHospitalAdmin._id,
        firstName,
        lastName,
        email,
        hospitalID
      }
    });
  } catch (error) {
    console.error("Error in addHospitalAdmin:", error.message);
    res.status(500).json({ msg: "Internal server error" });
  }
};
const getAllHospitals = async (req, res) => {
  try {
    const { role } = req.user;
    
    if (role !== "Admin") {
      return res.status(403).json({ msg: "Only admins can access hospital data" });
    }

    const hospitals = await Hospital.find()
      .select('name location contactNumber licenseNumber status')
      .lean();

    res.status(200).json(hospitals);
  } catch (error) {
    console.error("Error fetching hospitals:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};



const getHospitalDetail = async (req, res) => {
  try {
    const { id } = req.params;

    // Get hospital details
    const hospital = await Hospital.findById(id);
    if (!hospital) {
      return res.status(404).json({ msg: 'Hospital not found' });
    }

    // Get all admins for this hospital
    const admins = await HospitalAdministrator.find({ hospitalID: id })
      .select('-password -__v')
      .lean();

    res.status(200).json({
      hospital,
      admins
    });
  } catch (error) {
    console.error('Error fetching hospital details:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};
const updateHospital = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Validate required fields
    const requiredFields = ['name', 'location', 'contactNumber', 'licenseNumber'];
    for (const field of requiredFields) {
      if (!updateData[field]) {
        return res.status(400).json({ msg: `${field} is required` });
      }
    }

    const updatedHospital = await Hospital.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedHospital) {
      return res.status(404).json({ msg: 'Hospital not found' });
    }

    res.status(200).json(updatedHospital);
  } catch (error) {
    console.error('Error updating hospital:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ msg: error.message });
    }
    res.status(500).json({ msg: 'Server error' });
  }
};
const updateHospitalAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Remove restricted fields
    delete updateData.role;
    delete updateData.hospitalID;

    const updatedAdmin = await HospitalAdministrator.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password -__v');

    if (!updatedAdmin) {
      return res.status(404).json({ msg: 'Admin not found' });
    }

    res.status(200).json(updatedAdmin);
  } catch (error) {
    console.error('Error updating hospital admin:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ msg: error.message });
    }
    res.status(500).json({ msg: 'Server error' });
  }
};

const deleteHospitalAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedAdmin = await HospitalAdministrator.findByIdAndDelete(id);

    if (!deletedAdmin) {
      return res.status(404).json({ msg: 'Admin not found' });
    }

    res.status(200).json({ msg: 'Admin deleted successfully' });
  } catch (error) {
    console.error('Error deleting hospital admin:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

const getHospitalAdmin = async (req, res) => {
  try {
    const { hospitalId } = req.params; 

    
    if (!mongoose.Types.ObjectId.isValid(hospitalId)) {
      return res.status(400).json({ msg: 'Invalid hospital ID format' });
    }


    const hospitalExists = await Hospital.exists({ _id: hospitalId });
    if (!hospitalExists) {
      return res.status(404).json({ msg: 'Hospital not found' });
    }

    
    const admins = await HospitalAdministrator.find({ hospitalID: hospitalId })
      .populate('hospitalID', 'name location') 
      .select('-password -__v'); 

    res.status(200).json(admins);
  } catch (error) {
    console.error('Error fetching hospital admins:', error);
    res.status(500).json({ 
      msg: error.message || 'Server error' 
    });
  }
};



module.exports = {
  getHospitalAdmin,
  deleteHospitalAdmin,
  updateHospitalAdmin,
  getHospitalDetail,
  updateHospital,
  getAllHospitals,
  deleteHospital,
  registerHospital,
  viewAllRecords,
  getPatient,
  addHospitalAdmin,
};


