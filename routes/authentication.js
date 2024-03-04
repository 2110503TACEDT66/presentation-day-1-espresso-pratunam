const express = require('express');

const { register, login,providerLogin,providerRegister, getMe, logout} = require('../controllers/authController');

const router = express.Router();

const {protect}=require('../middleware/authMiddleware');

// ANCHOR User
router.post('/register', register);
router.post('/login', login);

//ANCHOR Provider
router.post('/provider/register', providerRegister);
router.post('/provider/login', providerLogin);

// ANCHOR Logout and Get me
router.post('/logout', logout);
router.get('/me', protect, getMe);




module.exports = router;

