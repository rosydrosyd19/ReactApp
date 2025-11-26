-- Add new fields to assets table for checkout dates
ALTER TABLE assets 
ADD COLUMN checkout_date DATE DEFAULT NULL,
ADD COLUMN expected_checkin_date DATE DEFAULT NULL;

-- Update checkout_history table to include dates
ALTER TABLE checkout_history
ADD COLUMN checkout_date DATE DEFAULT NULL,
ADD COLUMN expected_checkin_date DATE DEFAULT NULL;
