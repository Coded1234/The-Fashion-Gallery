const express = require("express");
const router = express.Router();
const shippingController = require("../controllers/shippingController");
const { protect } = require("../middleware/auth");

// Calculate shipping rate for a specific address (requires authentication)
router.post("/calculate", protect, shippingController.calculateShippingRate);

// Get available delivery options for an address (requires authentication)
router.post("/options", protect, shippingController.getDeliveryOptions);

module.exports = router;
