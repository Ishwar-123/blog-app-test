const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/User');

const authController = {
  // Show register form
  getRegister: (req, res) => {
    res.render('register', { 
      title: 'Register',
      currentPage: 'register' // Add this line
    });
  },

  // Handle register
  postRegister: async (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];

    if (!name || !email || !password || !password2) {
      errors.push({ msg: 'Please enter all fields' });
    }

    if (password != password2) {
      errors.push({ msg: 'Passwords do not match' });
    }

    if (password.length < 6) {
      errors.push({ msg: 'Password must be at least 6 characters' });
    }

    if (errors.length > 0) {
      res.render('register', {
        errors,
        name,
        email,
        password,
        password2,
        title: 'Register',
        currentPage: 'register' // Add this line
      });
    } else {
      try {
        const existingUser = await User.findOne({ email: email });
        
        if (existingUser) {
          errors.push({ msg: 'Email already exists' });
          res.render('register', {
            errors,
            name,
            email,
            password,
            password2,
            title: 'Register',
            currentPage: 'register' // Add this line
          });
        } else {
          const saltRounds = 10;
          const hashedPassword = await bcrypt.hash(password, saltRounds);
          
          const newUser = new User({
            name,
            email,
            password: hashedPassword
          });

          await newUser.save();
          req.flash('success_msg', 'You are now registered and can log in');
          res.redirect('/auth/login');
        }
      } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Something went wrong');
        res.redirect('/auth/register');
      }
    }
  },

  // Show login form
  getLogin: (req, res) => {
    res.render('login', { 
      title: 'Login',
      currentPage: 'login' // Add this line
    });
  },

  // Handle login
  postLogin: (req, res, next) => {
    passport.authenticate('local', {
      successRedirect: '/blogs',
      failureRedirect: '/auth/login',
      failureFlash: true
    })(req, res, next);
  },

  // Handle logout
  logout: (req, res) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      req.flash('success_msg', 'You are logged out');
      res.redirect('/auth/login');
    });
  }
};

module.exports = authController;
