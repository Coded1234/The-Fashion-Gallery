const express = require("express");
const router = express.Router();
const {
  register,
  login,
  googleLogin,
  facebookLogin,
  facebookDataDeletion,
  deleteAccount,
  getProfile,
  updateProfile,
  changePassword,
  toggleWishlist,
  getWishlist,
  uploadAvatar,
  deleteAvatar,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerificationEmail,
  logout,
} = require("../controllers/authController");
const { protect } = require("../middleware/auth");
const { authLimiter } = require("../middleware/rateLimiter");
const { avatarUpload } = require("../config/cloudinary");

// Public routes
router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.post("/logout", logout);
router.post("/google", authLimiter, googleLogin);
router.post("/facebook", authLimiter, facebookLogin);
router.post("/facebook/data-deletion", facebookDataDeletion);
router.post("/forgot-password", authLimiter, forgotPassword);
router.post("/reset-password/:token", authLimiter, resetPassword);
router.post("/verify-email", authLimiter, verifyEmail);
router.post("/resend-verification", authLimiter, resendVerificationEmail);

// Protected routes
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.put("/change-password", protect, changePassword);
router.post("/wishlist/:productId", protect, toggleWishlist);
router.get("/wishlist", protect, getWishlist);
router.post("/avatar", protect, avatarUpload.single("avatar"), uploadAvatar);
router.delete("/avatar", protect, deleteAvatar);
router.delete("/account", protect, deleteAccount);

module.exports = router;
