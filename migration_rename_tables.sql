-- ============================================
-- Database Restructuring Migration Script
-- OPSI B: Naming Convention with Prefixes
-- ============================================
-- This script renames all tables with appropriate prefixes:
-- - asset_* for Asset Management module
-- - core_* for Core/Shared module
-- ============================================

USE asset_management_db;

-- Disable foreign key checks temporarily
SET FOREIGN_KEY_CHECKS = 0;

-- ============================================
-- STEP 1: Rename Core Module Tables
-- ============================================
RENAME TABLE users TO core_users;

-- ============================================
-- STEP 2: Rename Asset Module Main Tables
-- ============================================
RENAME TABLE assets TO asset_items;
RENAME TABLE locations TO asset_locations;
RENAME TABLE licenses TO asset_licenses;
RENAME TABLE accessories TO asset_accessories;
RENAME TABLE components TO asset_components;
RENAME TABLE accounts TO asset_accounts;

-- ============================================
-- STEP 3: Rename Assignment/History Tables
-- ============================================
RENAME TABLE checkout_history TO asset_checkout_history;
RENAME TABLE license_assignments TO asset_license_assignments;
RENAME TABLE accessory_assignments TO asset_accessory_assignments;
RENAME TABLE component_assignments TO asset_component_assignments;
RENAME TABLE account_assignments TO asset_account_assignments;
RENAME TABLE location_checkout_history TO asset_location_checkout_history;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================
-- Verification: Show all tables
-- ============================================
SHOW TABLES;

-- ============================================
-- Success Message
-- ============================================
SELECT 'Database migration completed successfully!' AS Status;
SELECT 'All tables have been renamed with appropriate prefixes.' AS Message;
