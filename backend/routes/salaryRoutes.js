const express = require('express');
const router = express.Router();
const salaryController = require('../controllers/salaryController');

// pay salary
router.post('/pay', salaryController.paySalary);

// get all salary records
router.get('/all', salaryController.getAllSalary);

// get paid months (for all securities)
router.get('/paid', salaryController.getPaidMonths);

// get salary for single security
router.get('/:securityId', salaryController.getSalaryBySecurity);

module.exports = router;