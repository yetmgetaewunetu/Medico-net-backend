const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: [
        "admin",
        "HospitalAdministrator",
        "Receptionist",
        "Doctor",
        "Triage",
        "LabTechnician",
        "Pharmacist",
      ],
      required: true,
    },
  },
  { discriminatorKey: "role" }
);
userSchema.index({ email: 1, role: 1 }, { unique: true });

const User = mongoose.model("User", userSchema);
module.exports = User;
