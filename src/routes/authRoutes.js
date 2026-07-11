const express = require('express');
const router = express.Router();
// Impor objek controller
const authController = require('../controllers/authController');

// Panggil fungsi melalui objek authController
router.post('/login-admin', authController.loginAdmin);
router.post('/register', authController.registerCustomer);
router.post('/login-customer', authController.loginCustomer);
router.post('/logout', authController.logout);


module.exports = router;