// src/controllers/admin.controller.js
import { User } from "../models/user.model.js";
import { generateToken } from "../utils/jwtToken.js";

// Add New Admin
export const addNewAdmin = async (req, res, next) => {
  try {
    console.log("Request received to add new admin");
    const { firstName, lastName, email, phone, address, dob, gender, password } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !address || !dob || !gender || !password) {
      console.log("Missing required fields:", { firstName, lastName, email, phone, address, dob, gender, password });
      throw Object.assign(new Error("Please Fill Full Form!"), { statusCode: 400 });
    }

    // Check if user already exists
    const existedUser = await User.findOne({ email });
    if (existedUser) {
      throw Object.assign(new Error(`${existedUser.role} with this Email already Registered`), {
        statusCode: 400,
      });
    }

    // Create new admin
    const createdUser = await User.create({
      firstName,
      lastName,
      email,
      phone,
      address,
      dob: new Date(dob),
      gender,
      password,
      role: "Admin",
    });

    generateToken(createdUser, "Admin Added Successfully!", 200, res);
  } catch (error) {
    console.error("Error in addNewAdmin:", error);
    next(error);
  }
};