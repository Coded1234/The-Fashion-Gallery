const express = require("express");
const router = express.Router();
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  mergeCart,
} = require("../controllers/cartController");
const { protect, optionalAuth } = require("../middleware/auth");

router.use(optionalAuth);

router.get("/", getCart);
router.post("/add", addToCart);
router.put("/update/:itemId", updateCartItem);
router.delete("/remove/:itemId", removeFromCart);
router.delete("/clear", clearCart);
router.post("/merge", protect, mergeCart);

module.exports = router;
