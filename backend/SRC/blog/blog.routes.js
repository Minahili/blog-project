const express = require("express");
const upload = require("../../middleware/upload");
const blogController = require("./blog.controller");

const router = express.Router();

router.post("/", upload.single("image"), blogController.createBlog);
router.get("/", blogController.getBlogs);
router.delete("/:id", blogController.deleteBlog);

module.exports = router;
