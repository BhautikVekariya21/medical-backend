import express from 'express';
import {
    ToggleCart,
    deleteFromCart,
    getUserCart,
} from '../controllers/UserCart.controller.js';
import { isPatientAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/add-to-cart", (req, res, next) => {
    console.log("🛒 POST /add-to-cart called");
    ToggleCart(req, res, next);
});

router.delete("/delete-from-cart/:id", (req, res, next) => {
    console.log("❌ DELETE /delete-from-cart/:id called");
    deleteFromCart(req, res, next);
});

router.get("/user-cart/:userId", isPatientAuthenticated, (req, res, next) => {
    console.log("📦 GET /user-cart/:userId called");
    getUserCart(req, res, next);
});

export default router;
