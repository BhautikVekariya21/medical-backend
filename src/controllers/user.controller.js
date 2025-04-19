import { User } from '../models/user.model.js';
import { Appointment } from '../models/appointment.model.js';
import { generateToken } from '../utils/jwtToken.js';
import mongoose from 'mongoose';

// ✅ Register a Patient
export const patientRegister = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, address, dob, gender, password } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !address || !dob || !gender || !password) {
      throw Object.assign(new Error('Please Fill Full Form!'), { statusCode: 400 });
    }

    // Check if user already exists
    const existedUser = await User.findOne({ email });
    if (existedUser) {
      throw Object.assign(new Error(`${existedUser.role} with this Email already Registered`), {
        statusCode: 400,
      });
    }

    // Create new patient
    const createdUser = await User.create({
      firstName,
      lastName,
      email,
      phone,
      address,
      dob,
      gender,
      password,
      role: 'Patient',
    });

    // Generate token
    generateToken(createdUser, 'User Registered Successfully!', 200, res);
  } catch (error) {
    console.error('🚨 Registration error:', error.message);
    next(error);
  }
};

// ✅ Get logged-in User details (from auth middleware)
export const getUserDetails = async (req, res, next) => {
  try {
    const user = req.user; // populated from token middleware
    res.status(200).json({
      statusCode: 200,
      data: user,
      message: `${user.role} Details`,
    });
  } catch (error) {
    console.error('🚨 Fetching user details failed:', error.message);
    next(error);
  }
};

// ✅ Get Doctor details (if using a separate doctor login)
export const getDoctorDetails = async (req, res, next) => {
  try {
    const user = req.doctor;
    res.status(200).json({
      statusCode: 200,
      data: user,
      message: `${user.role} Details`,
    });
  } catch (error) {
    console.error('🚨 Fetching doctor details failed:', error.message);
    next(error);
  }
};

// ✅ Get Appointment Info by ID with patient & doctor data
export const getUserAppointmentInfo = async (req, res, next) => {
  try {
    const { appointmentId } = req.params;

    // Aggregation pipeline for joined info
    const pipeline = [
      {
        $match: {
          _id: new mongoose.Types.ObjectId(appointmentId),
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'patient',
          foreignField: '_id',
          as: 'patientDetails',
        },
      },
      { $unwind: '$patientDetails' },
      {
        $lookup: {
          from: 'doctors',
          localField: 'doctor',
          foreignField: '_id',
          as: 'doctorDetails',
        },
      },
      { $unwind: '$doctorDetails' },
      {
        $project: {
          _id: 1,
          appointmentDate: 1,
          status: 1,
          city: 1,
          pincode: 1,
          department: 1,
          'patientDetails.firstName': 1,
          'patientDetails.lastName': 1,
          'patientDetails.email': 1,
          'patientDetails.phone': 1,
          'doctorDetails.firstName': 1,
          'doctorDetails.lastName': 1,
          'doctorDetails.email': 1,
          'doctorDetails.phone': 1,
          'doctorDetails.department': 1,
          'doctorDetails.specializations': 1,
          'doctorDetails.experience': 1,
        },
      },
    ];

    const appointmentInfo = await Appointment.aggregate(pipeline);
    if (appointmentInfo.length === 0) {
      throw Object.assign(new Error('Appointment not found'), { statusCode: 404 });
    }

    res.status(200).json({
      statusCode: 200,
      data: appointmentInfo[0],
      message: 'Appointment Details',
    });
  } catch (error) {
    console.error('🚨 Fetching appointment info failed:', error.message);
    next(error);
  }
};
