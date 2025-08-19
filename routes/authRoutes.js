const express = require('express');
const passport = require('passport');
const router = express.Router();
const { forwardAuthenticated } = require('../middlewares/auth');
const authController = require('../controllers/authController');

// Register routes
router.get('/register', forwardAuthenticated, authController.getRegister);
router.post('/register', forwardAuthenticated, authController.postRegister);

// Login routes
router.get('/login', forwardAuthenticated, authController.getLogin);

// Local login with Passport
router.post('/login', forwardAuthenticated, (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',   // ✅ redirect to dashboard after login
    failureRedirect: '/auth/login',
    failureFlash: true
  })(req, res, next);
});

// Google Auth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/login' }),
  (req, res) => {
    res.redirect('/dashboard');   // ✅ same redirect as local login
  }
);

// Logout route
router.get('/logout', authController.logout);

module.exports = router;
