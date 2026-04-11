const express = require('express');
const router = express.Router();
const maintenanceController = require('../controllers/maintenanceController');

// Admin adds a maintenance month
router.post('/add-month', maintenanceController.addMaintenanceMonth);

// Get all maintenance months
router.get('/months', maintenanceController.getMaintenanceMonths);

// Get all maintenance records
router.get('/all', maintenanceController.getAllMaintenanceData);
router.get('/all-data', maintenanceController.getAllMaintenance);
router.get('/pending', maintenanceController.getPendingMaintenance);

// Resident pays maintenance
router.post('/pay', maintenanceController.recordPayment);

// Get maintenance data for a specific resident (paid + unpaid per flat)
router.get('/data', maintenanceController.getMaintenanceData);

// Get unpaid months only for resident
router.get('/unpaid-months', maintenanceController.getUnpaidMonths);

// Get only paid months for a resident
router.get('/paid-months', maintenanceController.getPaidMonths);

// ✅ Get status (paid + unpaid) for frontend
router.get('/status', maintenanceController.getMaintenanceData);

module.exports = router;