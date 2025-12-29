const blogSchema = require("./blog.schema");
// CREATE BLOG
const createBlog = async (req, res) => {
  try {
    const { title, content } = req.body;
    const image = req.file ? req.file.filename : null;

    const result = await blogSchema.createBlog(title, content, image);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET BLOGS
const getBlogs = async (req, res) => {
  try {
    const result = await blogSchema.getAllBlogs();
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE BLOG
const deleteBlog = async (req, res) => {
  try {
    await blogSchema.deleteBlogById(req.params.id);
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createBlog,
  getBlogs,
  deleteBlog,
};
