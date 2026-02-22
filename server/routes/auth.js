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
} = require("../controllers/authController");
const {
  getBiometricRegisterChallenge,
  verifyBiometricRegistration,
  getBiometricLoginChallenge,
  verifyBiometricLogin,
  removeBiometricCredential,
} = require("../controllers/biometricController");
const { protect } = require("../middleware/auth");
const { avatarUpload } = require("../config/cloudinary");

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/google", googleLogin);
router.post("/facebook", facebookLogin);
router.post("/facebook/data-deletion", facebookDataDeletion);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/verify-email", verifyEmail);
router.post("/resend-verification", resendVerificationEmail);

// Protected routes
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.put("/change-password", protect, changePassword);
router.post("/wishlist/:productId", protect, toggleWishlist);
router.get("/wishlist", protect, getWishlist);
router.post("/avatar", protect, avatarUpload.single("avatar"), uploadAvatar);
router.delete("/avatar", protect, deleteAvatar);
router.delete("/account", protect, deleteAccount);

// Biometric (WebAuthn) routes
// Public - login flow
router.post("/biometric/login-challenge", getBiometricLoginChallenge);
router.post("/biometric/login-verify", verifyBiometricLogin);
// Protected - registration flow (must be logged in to register a device)
router.post(
  "/biometric/register-challenge",
  protect,
  getBiometricRegisterChallenge,
);
router.post("/biometric/register-verify", protect, verifyBiometricRegistration);
router.delete("/biometric/:credentialID", protect, removeBiometricCredential);

module.exports = router;
