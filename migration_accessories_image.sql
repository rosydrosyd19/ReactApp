USE asset_management_db;

ALTER TABLE accessories
ADD COLUMN image_url VARCHAR(255) DEFAULT NULL;
