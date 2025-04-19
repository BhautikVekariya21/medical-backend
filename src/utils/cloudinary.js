import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import { config } from 'dotenv';

config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (filePath, originalName, retries = 3) => {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  let lastError;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder: 'medi-hub/images',
        public_id: `${Date.now()}_${originalName.split('.')[0]}`,
        resource_type: 'image',
      });
      console.log(`Uploaded ${originalName} to Cloudinary: ${result.secure_url}`);
      return result.secure_url;
    } catch (error) {
      console.warn(`Cloudinary upload attempt ${attempt} failed: ${error.message}`);
      lastError = error;
      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
      }
    }
  }
  throw new Error(`Cloudinary upload failed after ${retries} attempts: ${lastError.message}`);
};

export const deleteLocalFile = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.warn(`Failed to delete local file ${filePath}: ${err.message}`);
    } else {
      console.log(`Deleted local file: ${filePath}`);
    }
  });
};