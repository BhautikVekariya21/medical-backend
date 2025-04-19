import { UserCart } from '../models/UserCart.model.js';

// ✅ Add or Remove Medicine from Cart (Toggle)
export const ToggleCart = async (req, res, next) => {
  try {
    const { userId, medicineId, quantity, totalPrice, status } = req.body;

    // Validate required fields
    if (!userId || !medicineId || !quantity || !totalPrice) {
      console.warn('⚠️ Missing fields in ToggleCart:', req.body);
      throw Object.assign(new Error('Please fill all required fields!'), { statusCode: 400 });
    }

    // Validate data types
    if (isNaN(quantity) || quantity <= 0 || isNaN(totalPrice) || totalPrice < 0) {
      console.warn('⚠️ Invalid quantity or totalPrice:', { quantity, totalPrice });
      throw Object.assign(new Error('Quantity must be positive and totalPrice must be non-negative'), { statusCode: 400 });
    }

    // Check if medicine already exists in the cart
    let existedCart = await UserCart.findOne({ userId, medicineId });
    if (existedCart) {
      // Remove from cart if it already exists
      await UserCart.findByIdAndDelete(existedCart._id);
      console.log('✅ Medicine removed from cart:', existedCart._id);
      return res.status(200).json({
        success: true,
        statusCode: 200,
        data: { removeFromCart: true },
        message: 'Medicine deleted from cart successfully!',
      });
    }

    // Add medicine to the cart
    const cart = await UserCart.create({
      userId,
      medicineId,
      quantity,
      totalPrice,
      status,
    });
    console.log('✅ Medicine added to cart:', cart._id);

    res.status(201).json({
      success: true,
      statusCode: 201,
      data: cart,
      message: 'Medicine added to cart successfully!',
    });
  } catch (error) {
    console.error('🚨 Error in ToggleCart:', {
      message: error.message,
      statusCode: error.statusCode || 500,
      stack: error.stack,
    });
    next(error);
  }
};

// ✅ Delete Medicine from Cart by ID
export const deleteFromCart = async (req, res, next) => {
  try {
    const cartId = req.params.id;
    if (!cartId.match(/^[0-9a-fA-F]{24}$/)) {
      console.warn('⚠️ Invalid cart ID:', cartId);
      throw Object.assign(new Error('Invalid cart ID'), { statusCode: 400 });
    }

    const cart = await UserCart.findByIdAndDelete(cartId);
    if (!cart) {
      console.warn('⚠️ Cart item not found:', cartId);
      throw Object.assign(new Error('Medicine not found in cart'), { statusCode: 404 });
    }

    console.log('✅ Medicine deleted from cart:', cartId);
    res.status(200).json({
      success: true,
      statusCode: 200,
      data: {},
      message: 'Medicine deleted from cart successfully!',
    });
  } catch (error) {
    console.error('🚨 Error in deleteFromCart:', {
      message: error.message,
      statusCode: error.statusCode || 500,
      stack: error.stack,
    });
    next(error);
  }
};

// ✅ Get All Items in User's Cart
export const getUserCart = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const cart = await UserCart.find({ userId });
    if (!cart || cart.length === 0) {
      console.warn('⚠️ Cart empty or not found for user:', userId);
      throw Object.assign(new Error('Cart is empty or not found'), { statusCode: 404 });
    }

    console.log('✅ Cart fetched for user:', userId, `(${cart.length} items)`);
    res.status(200).json({
      success: true,
      statusCode: 200,
      data: cart,
      message: 'Cart fetched successfully!',
    });
  } catch (error) {
    console.error('🚨 Error in getUserCart:', {
      message: error.message,
      statusCode: error.statusCode || 500,
      stack: error.stack,
    });
    next(error);
  }
};