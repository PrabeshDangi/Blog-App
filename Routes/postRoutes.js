const { Router } = require("express");
const upload = require("../Middlewares/multer");
const { getAllBlogs, createBlog } = require("../Controllers/postController");

const router = Router();

router.route("/getblogs").get(getAllBlogs);
router.route("/createblog").post(upload.single("coverImage"), createBlog);

module.exports = router;
