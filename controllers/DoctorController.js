const MedicalRecord = require("../models/MedicalRecord");
const Patient = require("../models/Patient");
const Prescription = require("../models/Prescription");
const LabRequest = require("../models/LabRequest");

const viewAssignedRecord = async (req, res) => {
  try {
    const { faydaId } = req.params;

    if (!faydaId) {
      return res.status(400).json({ msg: "Doctor ID is required" });
    }

    const data = await MedicalRecord.find({ faydaID: faydaId });

    if (!data || data.length === 0) {
      return res
        .status(404)
        .json({ msg: "No medical records found for this doctor" });
    }

    // Process each medical record to populate prescriptions
    const processedData = await Promise.all(
      data.map(async (record) => {
        const prescriptions = await Promise.all(
          record.prescriptions.map(async (prescriptionId) => {
            const prescription = await Prescription.findOne({
              _id: prescriptionId,
            });
            return prescription ? prescription.medicineList : null;
          })
        );

        return {
          ...record.toObject(), // Convert Mongoose document to plain object
          prescriptions: prescriptions.filter((p) => p !== null), // Filter out null prescriptions
        };
      })
    );

    res.status(200).json({
      msg: "Medical records retrieved successfully",
      data: processedData,
    });
  } catch (error) {
    console.log(
      "error at view assigned record: doctor controller",
      error.message
    );
    res.status(500).json({ msg: "Internal server error" });
  }
};

const sendLabRequest = async (req, res) => {
  try {
    const { _id: doctorID, role } = req.user;
    const { patientID, testType, status } = req.body;

    if (role != "Doctor") {
      return res.status(400).json({ msg: "Only doctors can send lab request" });
    }

    if (!patientID || !doctorID || !testType) {
      return res.status(400).json({
        msg: "Please provide patientID, doctorID, and testType",
      });
    }

    const newLabRequest = new LabRequest({
      patientID,
      doctorID,
      testType,
      status: status || "Pending",
    });

    await newLabRequest.save();

    res.status(201).json({
      msg: "Lab request sent successfully",
      labRequest: newLabRequest,
    });
  } catch (error) {
    console.log("error at send lab request", error.message);

    res.status(500).json({
      msg: "Internal server error",
    });
  }
};

const uploadRecord = async (req, res) => {
  try {
    const { _id: doctorID } = req.user;

    const dateRecorded = Date.now();
    const {
      faydaID,
      patientID,
      diagnosis,
      prescriptions,
      generalMeasurements,
    } = req.body;

    console.log(prescriptions);

    // console.log(faydaID, patientID, doctorID);

    if (!faydaID || !patientID || !diagnosis) {
      return res.status(400).json({
        message: "Record ID is required",
      });
    }

    const newMedicalRecord = new MedicalRecord({
      faydaID,
      patientID,
      diagnosis,
      prescriptions,
      dateRecorded,
      doctorID,
      generalMeasurements,
    });

    await newMedicalRecord.save();

    res.status(200).json({
      newMedicalRecord,
    });
  } catch (error) {
    console.error(
      "Error updating medical record: doctor controller",
      error.message
    );

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const sendPrescription = async (req, res) => {
  try {
    const { role, _id: doctorID } = req.user;
    const { patientID, medicineList } = req.body;

    if (role != "Doctor") {
      return res
        .status(400)
        .json({ msg: "you have to be a doctor to send prescription!" });
    }

    if (!patientID || !doctorID) {
      return res.status(400).json({
        success: false,
        msg: "Patient ID and Doctor ID are required",
      });
    }

    if (!medicineList || medicineList.length === 0) {
      return res.status(400).json({
        success: false,
        msg: "At least one medicine is required in the prescription",
      });
    }

    const newPrescription = new Prescription({
      patientID,
      doctorID,
      medicineList,
      datePrescribed: new Date(),
      isFilled: false,
    });

    await newPrescription.save();

    res.status(201).json({
      msg: "Prescription created successfully",
      data: newPrescription,
    });
  } catch (error) {
    console.log("error at send prescription: doctor controller", error.message);

    res.status(500).json({
      msg: "Internal server error",
    });
  }
};

module.exports = {
  sendLabRequest,
  sendPrescription,
  uploadRecord,
  viewAssignedRecord,
};
