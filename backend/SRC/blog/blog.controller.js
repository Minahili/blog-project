const blogService = require("./blog.service");

const createBlog = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ 
        error: "Title and content are required" 
      });
    }

    const image = req.file ? req.file.filename : null;
    const blog = await blogService.createBlog(title, content, image);
    
    res.status(201).json({
      success: true,
      message: "Blog created successfully",
      data: blog,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: "Failed to create blog",
      message: error.message 
    });
  }
};

const getBlogs = async (req, res) => {
  try {
    const blogs = await blogService.getAllBlogs();
    
    res.status(200).json({
      success: true,
      count: blogs.length,
      data: blogs,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: "Failed to fetch blogs",
      message: error.message 
    });
  }
};

const getBlog = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({ 
        success: false,
        error: "Invalid blog ID" 
      });
    }

    const blog = await blogService.getBlogById(parseInt(id));

    if (!blog) {
      return res.status(404).json({ 
        success: false,
        error: "Blog not found" 
      });
    }

    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: "Failed to fetch blog",
      message: error.message 
    });
  }
};

const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({ 
        success: false,
        error: "Invalid blog ID" 
      });
    }

    const updateData = {};
    if (title) updateData.title = title;
    if (content) updateData.content = content;
    if (req.file) updateData.image = req.file.filename;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ 
        success: false,
        error: "No data provided to update" 
      });
    }

    const blog = await blogService.updateBlog(parseInt(id), updateData);

    if (!blog) {
      return res.status(404).json({ 
        success: false,
        error: "Blog not found" 
      });
    }

    res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      data: blog,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: "Failed to update blog",
      message: error.message 
    });
  }
};

const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({ 
        success: false,
        error: "Invalid blog ID" 
      });
    }

    const blog = await blogService.deleteBlogById(parseInt(id));

    if (!blog) {
      return res.status(404).json({ 
        success: false,
        error: "Blog not found" 
      });
    }

    res.status(200).json({ 
      success: true,
      message: "Blog deleted successfully",
      data: blog,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: "Failed to delete blog",
      message: error.message 
    });
  }
};

module.exports = {
  createBlog,
  getBlogs,
  getBlog,
  updateBlog,
  deleteBlog,
};
