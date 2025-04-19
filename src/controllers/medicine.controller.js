import { Medicine } from '../models/medicine.model.js';
import validator from 'validator'; // Import validator


export const addNewMedicine = async (req, res) => {
  try {
    const {
      name,
      price,
      description,
      category,
      manufacturer,
      expiryDate,
      stock,
      discount,
      image,
    } = req.body;

    // Validate required fields
    if (!name || !price || !description || !category || !manufacturer || !expiryDate || !stock || discount === undefined) {
      throw Object.assign(new Error('All required fields must be provided'), { statusCode: 400 });
    }

    // Validate numeric fields
    const parsedPrice = parseFloat(price);
    const parsedStock = parseInt(stock, 10);
    const parsedDiscount = parseFloat(discount);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      throw Object.assign(new Error('Price must be a positive number'), { statusCode: 400 });
    }
    if (isNaN(parsedStock) || parsedStock < 0) {
      throw Object.assign(new Error('Stock must be a non-negative integer'), { statusCode: 400 });
    }
    if (isNaN(parsedDiscount) || parsedDiscount < 0 || parsedDiscount > 100) {
      throw Object.assign(new Error('Discount must be between 0 and 100'), { statusCode: 400 });
    }

    // Validate expiry date
    const parsedExpiryDate = new Date(expiryDate);
    if (isNaN(parsedExpiryDate.getTime()) || parsedExpiryDate < new Date()) {
      throw Object.assign(new Error('Expiry date must be a valid future date'), { statusCode: 400 });
    }

    // Create medicine in MongoDB
    const medicine = await Medicine.create({
      name,
      price: parsedPrice,
      description,
      category,
      manufacturer,
      expiryDate: parsedExpiryDate,
      stock: parsedStock,
      discount: parsedDiscount,
      image: image || null, // Optional image field
    });

    return res.status(201).json({
      success: true,
      statusCode: 201,
      data: medicine,
      message: 'Medicine added successfully',
    });
  } catch (error) {
    console.error('Error in addNewMedicine:', {
      message: error.message,
      statusCode: error.statusCode || 500,
      stack: error.stack,
    });
    throw error;
  }
};

export const deleteMedicine = async (req, res, next) => {
  try {
    console.log('🗑️ Delete request for medicine ID:', req.params.id);
    const medicine = await Medicine.findByIdAndDelete(req.params.id);
    if (!medicine) {
      console.warn('⚠️ Medicine not found');
      throw Object.assign(new Error('Medicine not found'), { statusCode: 404 });
    }
    console.log('✅ Medicine deleted:', req.params.id);
    res.status(200).json({
      statusCode: 200,
      data: {},
      message: 'Medicine Deleted Successfully!',
    });
  } catch (error) {
    console.error('🚨 Error in deleteMedicine:', error.message);
    next(error);
  }
};

export const updateMedicine = async (req, res, next) => {
  try {
    console.log('🔄 Update request:', req.params.id, req.body);
    const { price, stock, discount } = req.body;

    if (price === undefined && stock === undefined && discount === undefined) {
      console.warn('⚠️ No fields to update');
      throw Object.assign(
        new Error('Please provide at least one field to update (price, stock, or discount)!'),
        { statusCode: 400 }
      );
    }

    const updateFields = {};
    if (price !== undefined) updateFields.price = price;
    if (stock !== undefined) updateFields.stock = stock;
    if (discount !== undefined) updateFields.discount = discount;

    const medicine = await Medicine.findByIdAndUpdate(req.params.id, updateFields, {
      new: true,
      runValidators: true,
    });
    if (!medicine) {
      console.warn('⚠️ Medicine not found');
      throw Object.assign(new Error('Medicine not found'), { statusCode: 404 });
    }

    console.log('✅ Medicine updated:', medicine._id);
    res.status(200).json({
      statusCode: 200,
      data: medicine,
      message: 'Medicine Updated Successfully!',
    });
  } catch (error) {
    console.error('🚨 Error in updateMedicine:', error.message);
    next(error);
  }
};

export const getHighDiscountMedicines = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const skip = (page - 1) * limit;

    console.log(`📦 Fetching medicines with discount >= 10, page ${page}, limit ${limit}`);
    const medicines = await Medicine.find({ discount: { $gte: 10 } }).skip(skip).limit(limit);

    if (!medicines || medicines.length === 0) {
      console.warn('⚠️ No medicines found with high discount');
      throw Object.assign(new Error('No medicines found'), { statusCode: 404 });
    }

    res.status(200).json({
      statusCode: 200,
      data: medicines,
      message: 'Medicines fetched successfully!',
    });
  } catch (error) {
    console.error('🚨 Error in getHighDiscountMedicines:', error.message);
    next(error);
  }
};


export const getCategoryMedicines = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    console.log(`📂 Fetching category: ${req.params.category}, page ${page}, limit ${limit}`);
    const medicines = await Medicine.find({
      category: req.params.category,
    }).skip(skip).limit(limit);

    if (!medicines || medicines.length === 0) {
      console.warn('⚠️ No medicines found in category');
      throw Object.assign(new Error('No medicines found'), { statusCode: 404 });
    }

    res.status(200).json({
      statusCode: 200,
      data: medicines,
      message: 'Medicines fetched successfully!',
    });
  } catch (error) {
    console.error('🚨 Error in getCategoryMedicines:', error.message);
    next(error);
  }
};

// ✅ Get Single Medicine
export const getSingleMedicine = async (req, res, next) => {
  try {
    console.log('🔍 Fetching medicine by ID:', req.params.id);
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) {
      console.warn('⚠️ Medicine not found');
      throw Object.assign(new Error('Medicine not found'), { statusCode: 404 });
    }

    res.status(200).json({
      statusCode: 200,
      data: medicine,
      message: 'Medicine fetched successfully!',
    });
  } catch (error) {
    console.error('🚨 Error in getSingleMedicine:', error.message);
    next(error);
  }
};

export const searchMedicine = async (req, res, next) => {
  try {
    const search = req.query.search ? validator.escape(req.query.search) : '';
    if (!search) {
      throw Object.assign(new Error('Search query is required'), { statusCode: 400 });
    }

    console.log('🔎 Searching medicines for:', search);
    const medicines = await Medicine.find({
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ],
    });

    if (!medicines || medicines.length === 0) {
      console.warn('⚠️ No medicines found for search:', search);
      throw Object.assign(new Error('No medicines found'), { statusCode: 404 });
    }

    res.status(200).json({
      statusCode: 200,
      data: medicines,
      message: 'Medicines fetched successfully!',
    });
  } catch (error) {
    console.error('🚨 Error in searchMedicine:', {
      message: error.message,
      statusCode: error.statusCode || 500,
      stack: error.stack,
    });
    next(error);
  }
};