const express = require('express');
const router = express.Router();


router.post('/register', registrationController.registerUser);
router.post('/login', registrationController.loginUser);

module.exports = router; 