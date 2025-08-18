const express = require('express');
const router = express.Router();
const { forwardAuthenticated } = require('../middlewares/auth');
const authController = require('../controllers/authController');

// Register routes
router.get('/register', forwardAuthenticated, authController.getRegister);
router.post('/register', forwardAuthenticated, authController.postRegister);

// Login routes
router.get('/login', forwardAuthenticated, authController.getLogin);
router.post('/login', forwardAuthenticated, authController.postLogin);

// Logout route
router.get('/logout', authController.logout);

module.exports = router;
