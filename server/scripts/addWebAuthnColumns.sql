-- Migration: Add WebAuthn (biometric) columns to users table
-- Run this once in production where sync({ alter: true }) is not used.

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS webauthn_credentials JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS webauthn_challenge    VARCHAR(255);
