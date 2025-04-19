import { User } from '../models/user.model.js';
import { Doctor } from '../models/doctor.model.js';
import { generateToken } from '../utils/jwtToken.js';

// ✅ LOGIN
export const login = async (req, res, next) => {
  try {
    console.log('📥 Login request received:', req.body);
    const { email, password, confirmPassword, role } = req.body;

    if (!email || !password || !confirmPassword || !role) {
      console.warn('⚠️ Missing required login fields');
      throw Object.assign(new Error('Please Fill Full Form!'), { statusCode: 400 });
    }

    if (password !== confirmPassword) {
      console.warn('⚠️ Password mismatch');
      throw Object.assign(new Error('Password and Confirm Password do not match!'), {
        statusCode: 400,
      });
    }

    let user;
    if (role === 'Patient' || role === 'Admin') {
      console.log(`🔍 Looking for ${role} in User model`);
      user = await User.findOne({ email }).select('+password');
    } else if (role === 'Doctor') {
      console.log('🔍 Looking for Doctor in Doctor model');
      user = await Doctor.findOne({ email }).select('+password');
    } else {
      console.error('❌ Invalid role provided:', role);
      throw Object.assign(new Error('Invalid role'), { statusCode: 400 });
    }

    if (!user) {
      console.warn(`❌ No user found with email: ${email} and role: ${role}`);
      throw Object.assign(new Error(`User with ${role} role not found`), { statusCode: 400 });
    }

    console.log('🔑 Verifying password...');
    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
      console.warn('❌ Password mismatch');
      throw Object.assign(new Error('Invalid email or password'), { statusCode: 400 });
    }

    console.log(`✅ ${role} authenticated successfully:`, user._id);
    generateToken(user, 'User Logged In Successfully', 200, res);
  } catch (error) {
    console.error('🚨 Login error:', error.message);
    next(error);
  }
};

// ✅ LOGOUT - Admin
export const logoutAdmin = async (req, res, next) => {
  try {
    console.log('📤 Admin logout initiated');
    res
      .status(200)
      .cookie('adminToken', '', {
        expires: new Date(Date.now()),
        httpOnly: true,
        secure: true,
        sameSite: 'None',
      })
      .json({
        statusCode: 200,
        data: null,
        message: 'Admin logged out successfully',
      });
  } catch (error) {
    console.error('🚨 Admin logout error:', error.message);
    next(error);
  }
};

// ✅ LOGOUT - Patient
export const logoutPatient = async (req, res, next) => {
  try {
    console.log('📤 Patient logout initiated');
    res
      .status(200)
      .cookie('patientToken', '', {
        expires: new Date(Date.now()),
        httpOnly: true,
        secure: true,
        sameSite: 'None',
      })
      .json({
        statusCode: 200,
        data: null,
        message: 'Patient logged out successfully',
      });
  } catch (error) {
    console.error('🚨 Patient logout error:', error.message);
    next(error);
  }
};

// ✅ LOGOUT - Doctor
export const logoutDoctor = async (req, res, next) => {
  try {
    console.log('📤 Doctor logout initiated');
    res
      .status(200)
      .cookie('doctorToken', '', {
        expires: new Date(Date.now()),
        httpOnly: true,
        secure: true,
        sameSite: 'None',
      })
      .json({
        statusCode: 200,
        data: null,
        message: 'Doctor logged out successfully',
      });
  } catch (error) {
    console.error('🚨 Doctor logout error:', error.message);
    next(error);
  }
};
