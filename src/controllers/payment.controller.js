
// ✅ Create Mock Checkout Order
export const checkout = async (req, res, next) => {
  try {
    console.log('💳 Checkout request received:', req.body);

    const { amount } = req.body;
    if (!amount) {
      console.warn('⚠️ Amount is missing in checkout request');
      throw Object.assign(new Error('Amount is required'), { statusCode: 400 });
    }

    // Validate amount is a positive number
    const parsedAmount = Number(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      console.warn('⚠️ Invalid amount:', amount);
      throw Object.assign(new Error('Amount must be a positive number'), { statusCode: 400 });
    }

    const order = {
      id: 'mock_order_' + Date.now(),
      amount: parsedAmount * 100, // Converting to paise (for INR)
      currency: 'INR',
    };

    console.log('✅ Mock order created:', order);
    res.status(200).json({
      success: true,
      statusCode: 200,
      data: { order },
      message: 'Mock order created successfully',
    });
  } catch (error) {
    console.error('🚨 Error in checkout:', {
      message: error.message,
      statusCode: error.statusCode || 500,
      stack: error.stack,
    });
    next(error);
  }
};

// 🚧 Placeholder for Payment Verification (Not Yet Implemented)
export const paymentVerification = async (req, res, next) => {
  try {
    console.log('🔐 Payment verification attempted:', req.body);
    throw Object.assign(new Error('Payment verification not implemented'), { statusCode: 501 });
  } catch (error) {
    console.warn('⚠️ Payment verification not yet implemented');
    next(Object.assign(error, {
      success: false,
      statusCode: error.statusCode || 501,
      message: error.message || 'Payment verification not implemented',
    }));
  }
};