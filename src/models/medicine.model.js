import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const medicineSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Medicine name is required'],
      minlength: [3, 'Medicine name must be at least 3 characters'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      minlength: [10, 'Description must be at least 10 characters'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: ['Tablet', 'Syrup', 'Injection', 'Drops', 'Cream', 'Powder', 'Lotion', 'Inhaler', 'Pain Relief'],
        message: '{VALUE} is not a valid category',
      },
    },
    manufacturer: {
      type: String,
      required: [true, 'Manufacturer is required'],
      trim: true,
    },
    expiryDate: {
      type: Date,
      required: [true, 'Expiry date is required'],
    },
    stock: {
      type: Number,
      required: [true, 'Stock is required'],
      min: [0, 'Stock cannot be negative'],
    },
    discount: {
      type: Number,
      required: [true, 'Discount is required'],
      min: [0, 'Discount cannot be negative'],
      max: [100, 'Discount cannot exceed 100%'],
    },
    // image: {
    //   type: String,
    //   required: [true, 'Image URL is required'],
    // },
  },
  { timestamps: true }
);

export const Medicine = model('Medicine', medicineSchema);