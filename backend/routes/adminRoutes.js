const express = require('express');
const router = express.Router();
const { registerAdmin, loginAdmin, resetPassword } = require('../controllers/adminController');

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.post('/reset-password', resetPassword);

module.exports = router;
