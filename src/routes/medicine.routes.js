import express from 'express';
import {
  addNewMedicine,
  updateMedicine,
  deleteMedicine,
  getHighDiscountMedicines,
  getCategoryMedicines,
  getSingleMedicine,
  searchMedicine,
} from '../controllers/medicine.controller.js';
import { isAdminAuthenticated } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Admin routes
router.post('/addmedicine', isAdminAuthenticated, async (req, res) => {
  try {
    await addNewMedicine(req, res);
  } catch (error) {
    if (!res.headersSent) {
      res.status(error.statusCode || 500).json({
        success: false,
        statusCode: error.statusCode || 500,
        message: error.message || 'Failed to add medicine',
      });
    }
  }
});

// Other routes
router.delete('/delete-medicine/:id', isAdminAuthenticated, deleteMedicine);
router.put('/update-medicine/:id', isAdminAuthenticated, updateMedicine);
router.get('/get/:id', getSingleMedicine);
router.get('/shop-by-category/:category', getCategoryMedicines);
router.get('/discount', getHighDiscountMedicines);
router.get('/search-medicine', searchMedicine);

export default router;