import express from "express";
import {
  checkout,
  paymentVerification,
} from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/checkout", (req, res, next) => {
  console.log("💳 POST /payment/checkout called");
  checkout(req, res, next);
});

router.post("/paymentverification", (req, res, next) => {
  console.log("✅ POST /payment/paymentverification called");
  paymentVerification(req, res, next);
});

export default router;
