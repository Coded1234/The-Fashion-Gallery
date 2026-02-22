import { useState, useCallback } from "react";
import {
  startRegistration,
  startAuthentication,
  browserSupportsWebAuthn,
} from "@simplewebauthn/browser";
import { useDispatch } from "react-redux";
import { authAPI } from "../utils/api";
import { biometricLogin } from "../redux/slices/authSlice";

/**
 * useBiometric — handles WebAuthn (biometric) registration and login.
 *
 * Usage:
 *   const { supported, registerBiometric, loginWithBiometric, loading, error } = useBiometric();
 */
const useBiometric = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const supported = browserSupportsWebAuthn();

  /**
   * Register the current device's biometrics.
   * Must be called when the user is already authenticated.
   * Returns true on success, false on failure.
   */
  const registerBiometric = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Get registration options from server
      const { data: options } = await authAPI.biometricRegisterChallenge();

      // 2. Prompt user for biometric (fingerprint / Face ID / Windows Hello)
      // v13: startRegistration takes { optionsJSON } not the options directly
      const registrationResponse = await startRegistration({
        optionsJSON: options,
      });

      // 3. Verify with server and save credential
      const { data: result } =
        await authAPI.biometricRegisterVerify(registrationResponse);

      return result;
    } catch (err) {
      // User cancelled or device doesn't support it
      if (err.name === "NotAllowedError") {
        const msg = "Biometric prompt was dismissed. Please try again.";
        setError(msg);
        return { verified: false, message: msg };
      }
      const msg =
        err.response?.data?.message || err.message || "Registration failed";
      setError(msg);
      return { verified: false, message: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Authenticate with biometrics (login flow).
   * @param {string} email - The user's email to look up credentials.
   * Returns the user data on success, throws on failure.
   */
  const loginWithBiometric = useCallback(
    async (email) => {
      setLoading(true);
      setError(null);
      try {
        // 1. Get authentication options (challenge) from server
        const { data: options } = await authAPI.biometricLoginChallenge(email);

        // 2. Prompt user for biometric
        // v13: startAuthentication takes { optionsJSON } not the options directly
        const authenticationResponse = await startAuthentication({
          optionsJSON: options,
        });

        // 3. Verify with server — returns JWT + user data
        const { data: userData } = await authAPI.biometricLoginVerify(
          email,
          authenticationResponse,
        );

        // 4. Persist token and update Redux auth state
        await dispatch(biometricLogin(userData)).unwrap();

        return userData;
      } catch (err) {
        if (err.name === "NotAllowedError") {
          const msg = "Biometric prompt was dismissed. Please try again.";
          setError(msg);
          throw new Error(msg);
        }
        const msg =
          err.response?.data?.message ||
          err.message ||
          "Biometric login failed";
        setError(msg);
        throw new Error(msg);
      } finally {
        setLoading(false);
      }
    },
    [dispatch],
  );

  /**
   * Remove a registered biometric credential.
   * @param {string} credentialID
   */
  const removeBiometric = useCallback(async (credentialID) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await authAPI.removeBiometricCredential(credentialID);
      return data;
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Failed to remove credential";
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    supported,
    loading,
    error,
    registerBiometric,
    loginWithBiometric,
    removeBiometric,
  };
};

export default useBiometric;
