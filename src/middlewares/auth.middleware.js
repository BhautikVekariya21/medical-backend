// src/middlewares/auth.middleware.js
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { Doctor } from "../models/doctor.model.js";

export const isAdminAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.adminToken;
    if (!token) {
      throw Object.assign(new Error("Please Login to access this resource"), { statusCode: 401 });
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findById(decodedData.id);
    if (!user || user.role !== "Admin") {
      throw Object.assign(new Error("Json Web Token is invalid, Try again!"), { statusCode: 400 });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("🚨 Error in isAdminAuthenticated:", error.message);
    next(error);
  }
};

export const isPatientAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.patientToken;
    if (!token) {
      throw Object.assign(new Error("Please Login to access this resource"), { statusCode: 401 });
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findById(decodedData.id);
    if (!user || user.role !== "Patient") {
      throw Object.assign(new Error("Json Web Token is invalid, Try again!"), { statusCode: 400 });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("🚨 Error in isPatientAuthenticated:", error.message);
    next(error);
  }
};

export const isDoctorAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.doctorToken;
    if (!token) {
      throw Object.assign(new Error("Please Login to access this resource"), { statusCode: 401 });
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const doctor = await Doctor.findById(decodedData.id);
    if (!doctor || doctor.role !== "Doctor") {
      throw Object.assign(new Error("Json Web Token is invalid, Try again!"), { statusCode: 400 });
    }

    req.doctor = doctor;
    next();
  } catch (error) {
    console.error("🚨 Error in isDoctorAuthenticated:", error.message);
    next(error);
  }
};