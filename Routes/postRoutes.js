const { Router } = require("express");
const upload = require("../Middlewares/multer");
const {
  getAllBlogs,
  createBlog,
  updateBlog,
  updateCoverImage,
  deleteBlog,
} = require("../Controllers/postController");

const verifyJWT = require("../Middlewares/authentication.Middleware");
const router = Router();

router.route("/getblogs").get(getAllBlogs);
//Protected routes
router
  .route("/createblog")
  .post(verifyJWT, upload.single("coverImage"), createBlog);

router.route("/updateblog/:id").post(verifyJWT, updateBlog);

router
  .route("/updateImage/:id")
  .post(verifyJWT, upload.single("coverImage"), updateCoverImage);

router.route("/deleteblog/:id").post(verifyJWT, deleteBlog);

module.exports = router;
