const express = require("express");
const router = express.Router();
const {
  initializePayment,
  verifyPayment,
  paystackWebhook,
} = require("../controllers/paymentController");
const { protect, optionalAuth } = require("../middleware/auth");

router.post("/initialize", optionalAuth, initializePayment);
router.get("/verify/:reference", optionalAuth, verifyPayment);
router.post("/webhook", paystackWebhook);

module.exports = router;
