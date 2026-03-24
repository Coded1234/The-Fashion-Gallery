const express = require("express");
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  getOrderById,
  cancelOrder,
  trackOrder,
} = require("../controllers/orderController");
const { protect, optionalAuth } = require("../middleware/auth");
const { orderLimiter } = require("../middleware/rateLimiter");

// Create Order allows guests, others require auth
router.post("/", optionalAuth, orderLimiter, createOrder);

// All other routes are protected
router.use(protect);

router.get("/", getUserOrders);
router.get("/:id", getOrderById);
router.put("/:id/cancel", cancelOrder);
router.get("/:id/track", trackOrder);

module.exports = router;
