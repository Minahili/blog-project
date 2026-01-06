const { db } = require("../db");
const { blogs } = require("../db/schema");
const { eq, desc } = require("drizzle-orm");

const createBlog = async (title, content, image) => {
  const result = await db
    .insert(blogs)
    .values({ title, content, image })
    .returning();
  return result[0];
};

const getAllBlogs = async () => {
  return await db
    .select()
    .from(blogs)
    .orderBy(desc(blogs.id));
};

const getBlogById = async (id) => {
  const result = await db
    .select()
    .from(blogs)
    .where(eq(blogs.id, id))
    .limit(1);
  return result[0];
};

const updateBlog = async (id, data) => {
  const result = await db
    .update(blogs)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(blogs.id, id))
    .returning();
  return result[0];
};

const deleteBlogById = async (id) => {
  const result = await db
    .delete(blogs)
    .where(eq(blogs.id, id))
    .returning();
  return result[0];
};

module.exports = {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlogById,
};

