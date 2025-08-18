const Blog = require('../models/Blog');
const User = require('../models/User');

const blogController = {
  // Show all blogs
  getAllBlogs: async (req, res) => {
    try {
      const blogs = await Blog.find({ isPublished: true })
        .populate('author', 'name email')
        .sort({ createdAt: -1 });
      
      res.render('blogList', { 
        blogs, 
        title: 'All Blogs',
        currentPage: 'home'
      });
    } catch (error) {
      console.error(error);
      req.flash('error_msg', 'Error loading blogs');
      res.redirect('/');
    }
  },

  // Get blog by slug
getBlogBySlug: async (req, res) => {
  try {
    const blog = await Blog.findOne({ 
      slug: req.params.slug, 
      isPublished: true 
    }).populate('author', 'name email');
    
    if (!blog) {
      req.flash('error_msg', 'Blog not found');
      return res.redirect('/blogs');
    }

    res.render('blogDetail', { 
      blog, 
      title: blog.title,
      currentPage: 'detail'
    });
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Error loading blog');
    res.redirect('/blogs');
  }
},


  // Show user dashboard
  getDashboard: async (req, res) => {
    try {
      const userBlogs = await Blog.find({ author: req.user._id })
        .sort({ createdAt: -1 });
      
      res.render('dashboard', { 
        blogs: userBlogs, 
        title: 'My Dashboard',
        currentPage: 'dashboard'
      });
    } catch (error) {
      console.error(error);
      req.flash('error_msg', 'Error loading dashboard');
      res.redirect('/blogs');
    }
  },

  // Show create blog form
  getCreateBlog: (req, res) => {
    res.render('blogForm', { 
      title: 'Create New Blog',
      blog: null,
      action: 'create',
      currentPage: 'create'
    });
  },

  // Handle create blog
  postCreateBlog: async (req, res) => {
    try {
      const { title, content, tags, isPublished } = req.body;
      
      const blog = new Blog({
        title,
        content,
        author: req.user._id,
        tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
        isPublished: isPublished === 'on'
      });

      await blog.save();
      req.flash('success_msg', 'Blog created successfully!');
      res.redirect('/blogs/dashboard');
    } catch (error) {
      console.error(error);
      req.flash('error_msg', 'Error creating blog');
      res.redirect('/blogs/create');
    }
  },

  // Show edit blog form
  getEditBlog: async (req, res) => {
    try {
      const blog = await Blog.findOne({ 
        _id: req.params.id, 
        author: req.user._id 
      });
      
      if (!blog) {
        req.flash('error_msg', 'Blog not found or unauthorized');
        return res.redirect('/blogs/dashboard');
      }

      res.render('blogForm', { 
        title: 'Edit Blog',
        blog,
        action: 'edit',
        currentPage: 'edit'
      });
    } catch (error) {
      console.error(error);
      req.flash('error_msg', 'Error loading blog');
      res.redirect('/blogs/dashboard');
    }
  },

  // Handle update blog
  putUpdateBlog: async (req, res) => {
    try {
      const { title, content, tags, isPublished } = req.body;
      
      const blog = await Blog.findOneAndUpdate(
        { _id: req.params.id, author: req.user._id },
        {
          title,
          content,
          tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
          isPublished: isPublished === 'on'
        },
        { new: true }
      );

      if (!blog) {
        req.flash('error_msg', 'Blog not found or unauthorized');
        return res.redirect('/blogs/dashboard');
      }

      req.flash('success_msg', 'Blog updated successfully!');
      res.redirect('/blogs/dashboard');
    } catch (error) {
      console.error(error);
      req.flash('error_msg', 'Error updating blog');
      res.redirect('/blogs/dashboard');
    }
  },

  // Handle delete blog
  deleteBlog: async (req, res) => {
    try {
      const blog = await Blog.findOneAndDelete({ 
        _id: req.params.id, 
        author: req.user._id 
      });

      if (!blog) {
        req.flash('error_msg', 'Blog not found or unauthorized');
        return res.redirect('/blogs/dashboard');
      }

      req.flash('success_msg', 'Blog deleted successfully!');
      res.redirect('/blogs/dashboard');
    } catch (error) {
      console.error(error);
      req.flash('error_msg', 'Error deleting blog');
      res.redirect('/blogs/dashboard');
    }
  },

  // Show single blog
  getBlogById: async (req, res) => {
    try {
      const blog = await Blog.findById(req.params.id)
        .populate('author', 'name email');
      
      if (!blog || !blog.isPublished) {
        req.flash('error_msg', 'Blog not found');
        return res.redirect('/blogs');
      }

      res.render('blogDetail', { 
        blog, 
        title: blog.title,
        currentPage: 'detail'
      });
    } catch (error) {
      console.error(error);
      req.flash('error_msg', 'Error loading blog');
      res.redirect('/blogs');
    }
  }
};

module.exports = blogController;
