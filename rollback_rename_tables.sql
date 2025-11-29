-- ============================================
-- Rollback Script for Database Migration
-- ============================================
-- Use this script to revert table names to original
-- if migration causes issues
-- ============================================

USE asset_management_db;

-- Disable foreign key checks temporarily
SET FOREIGN_KEY_CHECKS = 0;

-- ============================================
-- Rollback Core Module Tables
-- ============================================
RENAME TABLE core_users TO users;

-- ============================================
-- Rollback Asset Module Main Tables
-- ============================================
RENAME TABLE asset_items TO assets;
RENAME TABLE asset_locations TO locations;
RENAME TABLE asset_licenses TO licenses;
RENAME TABLE asset_accessories TO accessories;
RENAME TABLE asset_components TO components;
RENAME TABLE asset_accounts TO accounts;

-- ============================================
-- Rollback Assignment/History Tables
-- ============================================
RENAME TABLE asset_checkout_history TO checkout_history;
RENAME TABLE asset_license_assignments TO license_assignments;
RENAME TABLE asset_accessory_assignments TO accessory_assignments;
RENAME TABLE asset_component_assignments TO component_assignments;
RENAME TABLE asset_account_assignments TO account_assignments;
RENAME TABLE asset_location_checkout_history TO location_checkout_history;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================
-- Verification
-- ============================================
SHOW TABLES;

SELECT 'Rollback completed successfully!' AS Status;
SELECT 'All tables have been reverted to original names.' AS Message;
