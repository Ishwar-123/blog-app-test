const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middlewares/auth');
const blogController = require('../controllers/blogController');

// Public routes
router.get('/', blogController.getAllBlogs);
router.get('/blog/:slug', blogController.getBlogBySlug); // Changed from :id to :slug

// Protected routes
router.get('/dashboard', ensureAuthenticated, blogController.getDashboard);
router.get('/create', ensureAuthenticated, blogController.getCreateBlog);
router.post('/create', ensureAuthenticated, blogController.postCreateBlog);
router.get('/edit/:id', ensureAuthenticated, blogController.getEditBlog);
router.put('/edit/:id', ensureAuthenticated, blogController.putUpdateBlog);
router.delete('/delete/:id', ensureAuthenticated, blogController.deleteBlog);

module.exports = router;
