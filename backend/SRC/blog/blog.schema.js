const pool =require("../../db.js");

// Create blog
const createBlog = (title, content, image) => {
  return pool.query(
    "INSERT INTO blogs (title, content, image) VALUES ($1,$2,$3) RETURNING *",
    [title, content, image]
  );
};

// Get all blogs
const getAllBlogs = () => {
  return pool.query("SELECT * FROM blogs ORDER BY id DESC");
};

// Delete blog
const deleteBlogById = (id) => {
  return pool.query("DELETE FROM blogs WHERE id=$1", [id]);
};

module.exports = {
  createBlog,
  getAllBlogs,
}