
// controllers/staffController.js
import bcrypt from 'bcryptjs';
import Doctor from '../models/Doctor.js';
import Pharmacist from '../models/Pharmacist.js';
import LabTechnician from '../models/LabTechnician.js';
import Receptionist from '../models/Receptionist.js';
import Triage from '../models/Triage.js';
import HospitalAdministrator from '../models/HospitalAdministrator.js';

const RoleModels = {
  doctor: Doctor,
  pharmacist: Pharmacist,
  labtechnician: LabTechnician,
  receptionist: Receptionist,
  triage: Triage,
  hospitaladministrator: HospitalAdministrator
};

export const addStaffAccount = async (req, res) => {
  try {
    const { role, ...data } = req.body;
    const { role: staffRole } = req.user;

    // Authorization check
    if (!staffRole || staffRole.toLowerCase() !== "hospitaladministrator") {
      return res.status(403).json({ 
        message: "Only hospital administrators can add staff members" 
      });
    }

    // Validate role
    const lowerCaseRole = role.toLowerCase();
    if (!RoleModels[lowerCaseRole]) {
      return res.status(400).json({ message: "Invalid role provided" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    // Create staff member
    const StaffModel = RoleModels[lowerCaseRole];
    const staff = new StaffModel({
      ...data,
      password: hashedPassword,
      role: lowerCaseRole
    });

    await staff.save();
    
    res.status(201).json({ 
      message: "Staff account created successfully",
      staff: staff.toObject()
    });
  } catch (error) {
    console.error("Error in addStaffAccount:", error);
    res.status(500).json({ 
      message: "Error creating staff account", 
      error: error.message 
    });
  }
};

export const updateStaffAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, ...data } = req.body;
    const { role: staffRole } = req.user;

    // Authorization check
    if (!staffRole || staffRole.toLowerCase() !== "hospitaladministrator") {
      return res.status(403).json({ 
        message: "Only hospital administrators can update staff members" 
      });
    }

    // Validate role if changing
    const lowerCaseRole = role?.toLowerCase();
    if (role && !RoleModels[lowerCaseRole]) {
      return res.status(400).json({ message: "Invalid role provided" });
    }

    // Find the staff member by ID across all collections
    let staff = null;
    for (const model of Object.values(RoleModels)) {
      staff = await model.findById(id);
      if (staff) break;
    }

    if (!staff) {
      return res.status(404).json({ message: "Staff member not found" });
    }

    // Update staff member
    Object.assign(staff, data);
    if (data.password) {
      const salt = await bcrypt.genSalt(10);
      staff.password = await bcrypt.hash(data.password, salt);
    }

    await staff.save();
    
    res.status(200).json({ 
      message: "Staff account updated successfully",
      staff: staff.toObject()
    });
  } catch (error) {
    console.error("Error in updateStaffAccount:", error);
    res.status(500).json({ 
      message: "Error updating staff account", 
      error: error.message 
    });
  }
};

export const getStaff = async (req, res) => {
  try {
    const staff = await Promise.all(
      Object.values(RoleModels).map(model => model.find())
    ).then(results => results.flat());

    res.status(200).json(staff);
  } catch (error) {
    console.error("Error in getStaff:", error);
    res.status(500).json({ 
      message: "Error fetching staff", 
      error: error.message 
    });
  }
};
export const deleteStaffAccount = async (req, res) => {
  try {
    const { role: staffRole } = req.user;

    if (!staffRole || staffRole != "HospitalAdministrator") {
      return res
        .status(400)
        .json({ message: "Only hospital admins can add staff member" });
    }

    const { staffId } = req.params;
    const deletedUser = await User.findByIdAndDelete(staffId);

    if (!deletedUser) {
      return res.status(404).json({ message: "Staff not found" });
    }

    res.status(200).json({ message: "Staff deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting staff", error: error.message });
  }
};

export const viewPatientsByHospital = async (req, res) => {
  try {
    const { role: staffRole } = req.user;

    if (!staffRole || staffRole != "HospitalAdministrator") {
      return res.status(400).json({
        message: "Only hospital admins can view patients list by hospital id",
      });
    }

    const { hospitalID } = req.params;
    // console.log(hospitalID);
    const patients = await Patient.find({ registeredHospital: hospitalID });

    if (!patients.length) {
      return res
        .status(404)
        .json({ message: "No patients found for this hospital" });
    }

    res.status(200).json({ patients });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching patients", error: error.message });
  }
};

// module.exports = {
//   getStaff,
//   addStaffAccount,
//   updateStaffAccount,
//   deleteStaffAccount,
//   viewPatientsByHospital,
// };
