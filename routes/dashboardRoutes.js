const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middlewares/auth');
const Blog = require('../models/Blog'); // assuming you have a Blog model

// Dashboard
router.get('/', ensureAuthenticated, async (req, res) => {
  try {
    // fetch blogs owned by this user
    const blogs = await Blog.find({ user: req.user.id }).sort({ createdAt: -1 });

    res.render('dashboard', {
      user: req.user,
      blogs
    });
  } catch (err) {
    console.error(err);
    res.render('dashboard', {
      user: req.user,
      blogs: []
    });
  }
});

module.exports = router;
