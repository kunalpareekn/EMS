const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const { loginLimiter } = require('../middleware/rateLimiter');

// Employee Registration & Login
router.post('/register', employeeController.registerEmployee);
router.post('/login', loginLimiter, employeeController.loginEmployee);

module.exports = router; 