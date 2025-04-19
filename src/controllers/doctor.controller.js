// src/controllers/doctor.controller.js
import { Doctor } from "../models/doctor.model.js";
import { generateToken } from "../utils/jwtToken.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";

// Add New Doctor
export const addNewDoctor = async (req, res, next) => {
  try {
    console.log("📥 addNewDoctor called");
    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      address,
      gender,
      dob, // Added dob
      experience,
      availabelSlots,
      appointmentCharges,
    } = req.body;

    // Parse nested fields sent as strings in form-data
    const parsedAddress = typeof address === "string" ? JSON.parse(address) : address;
    const department = typeof req.body.department === "string" ? JSON.parse(req.body.department) : req.body.department;
    const specializations = typeof req.body.specializations === "string" ? JSON.parse(req.body.specializations) : req.body.specializations;
    const qualifications = typeof req.body.qualifications === "string" ? JSON.parse(req.body.qualifications) : req.body.qualifications;
    const languagesKnown = typeof req.body.languagesKnown === "string" ? JSON.parse(req.body.languagesKnown) : req.body.languagesKnown;
    const parsedAvailabelSlots = typeof availabelSlots === "string" ? JSON.parse(availabelSlots) : availabelSlots;

    console.log("🔍 Incoming data:", {
      firstName,
      lastName,
      email,
      phone,
      password,
      address: parsedAddress,
      gender,
      dob,
      department,
      specializations,
      qualifications,
      experience,
      availabelSlots: parsedAvailabelSlots,
      languagesKnown,
      appointmentCharges,
    });

    // Validate required fields
    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !password ||
      !parsedAddress ||
      !gender ||
      !dob || // Added dob to validation
      !department ||
      !specializations ||
      !qualifications ||
      !experience ||
      !parsedAvailabelSlots ||
      !languagesKnown ||
      !appointmentCharges
    ) {
      console.warn("⚠️ Incomplete doctor form data");
      throw Object.assign(new Error("Please Fill Full Form!"), { statusCode: 400 });
    }

    // Check for existing doctor
    let existedDoctor = await Doctor.findOne({ email });
    if (existedDoctor) {
      console.warn(`⚠️ Doctor already exists with email: ${email}`);
      throw Object.assign(new Error(`${existedDoctor.role} with this Email already Registered`), {
        statusCode: 400,
      });
    }

    // Handle file upload
    const docAvatarLocalPath = req.file?.path;
    if (!docAvatarLocalPath) {
      console.error("❌ Avatar file not found in request");
      throw Object.assign(new Error("Doctor Avatar Path Not Found!"), { statusCode: 400 });
    }

    console.log("📤 Uploading avatar to Cloudinary...");
    const avatar = await uploadToCloudinary(docAvatarLocalPath);
    if (!avatar) {
      console.error("❌ Avatar upload failed");
      throw Object.assign(new Error("Doctor Avatar is required"), { statusCode: 400 });
    }

    console.log("✅ Avatar uploaded:", avatar.url);

    // Create new doctor
    const createdDoctor = await Doctor.create({
      firstName,
      lastName,
      email,
      phone,
      password,
      address: parsedAddress,
      gender,
      dob: new Date(dob), // Ensure dob is stored as a Date
      department,
      specializations,
      qualifications,
      experience,
      availabelSlots: parsedAvailabelSlots,
      languagesKnown,
      appointmentCharges,
      role: "Doctor",
      docAvatar: avatar.url,
    });

    console.log("✅ Doctor created in DB:", createdDoctor._id);

    generateToken(createdDoctor, "Doctor Added Successfully!", 200, res);
  } catch (error) {
    console.error("🚨 Error in addNewDoctor:", error.message);
    next(error);
  }
};

// Get All Doctors
export const getAllDoctors = async (req, res, next) => {
  try {
    console.log("📄 Fetching all doctors...");
    const doctors = await Doctor.find({ role: "Doctor" });

    console.log(`📋 ${doctors.length} doctors found`);

    res.status(200).json({
      statusCode: 200,
      data: doctors,
      message: "DOCTORS LIST",
    });
  } catch (error) {
    console.error("🚨 Error in getAllDoctors:", error.message);
    next(error);
  }
};