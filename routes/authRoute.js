const express = require('express');
const { signup, login, forgotPassword, resetPassword, } = require('../controllers/authController');
const { validateUser, validateLogin, } = require('../validations/validation');

const router = express.Router();

router.post('/signup', validateUser, signup);
router.post('/login', validateLogin, login);
router.post('/forgot-password', forgotPassword); 
router.post('/reset-password', resetPassword); 

module.exports = router;