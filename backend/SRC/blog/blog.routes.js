const express = require("express");
const upload = require("../../middleware/upload");
const blogController = require("./blog.controller");

const router = express.Router();

router.post("/", upload.single("image"), blogController.createBlog);
router.get("/", blogController.getBlogs);
router.get("/:id", blogController.getBlog);
router.put("/:id", upload.single("image"), blogController.updateBlog);
router.delete("/:id", blogController.deleteBlog);

module.exports = router;
