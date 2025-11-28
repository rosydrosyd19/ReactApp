const express = require('express');
const router = express.Router();
const assetController = require('../controllers/asset.controller');
const upload = require('../../../shared/middleware/upload');

// Asset CRUD routes
router.get('/', assetController.getAllAssets);
router.get('/:id', assetController.getAssetById);
router.post('/', upload.single('image'), assetController.createAsset);
router.put('/:id', upload.single('image'), assetController.updateAsset);
router.delete('/:id', assetController.deleteAsset);

// Checkout/Checkin routes
router.post('/:id/checkout', assetController.checkoutAsset);
router.post('/:id/checkin', assetController.checkinAsset);

// History and assignments routes
router.get('/:id/history', assetController.getCheckoutHistory);
router.get('/:id/licenses', assetController.getAssetLicenses);
router.get('/:id/accessories', assetController.getAssetAccessories);
router.get('/:id/components', assetController.getAssetComponents);
router.get('/:id/accounts', assetController.getAssetAccounts);

// Maintenance routes
router.post('/:id/maintenance', assetController.addMaintenance);
router.get('/:id/maintenance', assetController.getMaintenanceHistory);
router.put('/maintenance/:maintenanceId', assetController.updateMaintenance);
router.delete('/maintenance/:maintenanceId', assetController.deleteMaintenance);

module.exports = router;
