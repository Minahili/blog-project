const express = require("express");
const pool = require("../db");
const upload = require("../middleware/upload");

const router = express.Router();

// CREATE BLOG
router.post("/", upload.single("image"), async (req, res) => {
  const { title, content } = req.body;
  const image = req.file ? req.file.filename : null;

  const result = await pool.query(
    "INSERT INTO blogs (title, content, image) VALUES ($1,$2,$3) RETURNING *",
    [title, content, image]
  );

  res.json(result.rows[0]);
});

// GET BLOGS
router.get("/", async (req, res) => {
  const result = await pool.query("SELECT * FROM blogs ORDER BY id DESC");
  res.json(result.rows);
});

// DELETE BLOG
router.delete("/:id", async (req, res) => {
  await pool.query("DELETE FROM blogs WHERE id=$1", [req.params.id]);
  res.json({ message: "Deleted" });
});

module.exports = router;
