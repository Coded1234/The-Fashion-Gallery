-- Migration SQL for Production Database
-- Run this directly on your Vercel/Neon database

-- Add ai_message column to coupons table
ALTER TABLE coupons 
ADD COLUMN IF NOT EXISTS ai_message TEXT;

COMMENT ON COLUMN coupons.ai_message IS 'AI-generated promotional message for the coupon';

-- Verify the column was added
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'coupons' 
ORDER BY ordinal_position;
