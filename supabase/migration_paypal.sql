-- Migration: replace Stripe with PayPal
-- Run this in the Supabase SQL Editor

ALTER TABLE users ADD COLUMN IF NOT EXISTS paypal_subscription_id TEXT;
CREATE INDEX IF NOT EXISTS idx_users_paypal_subscription ON users(paypal_subscription_id);
