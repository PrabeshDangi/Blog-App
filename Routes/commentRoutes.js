const Router = require("express");
const router = Router();
const verifyJWT = require("../Middlewares/authentication.Middleware");

const {
  getAllComments,
  createComment,
} = require("../Controllers/commentController");

router.route("/createcomment/:id").post(verifyJWT, createComment);
router.route("/getcomment/:id").get(getAllComments);

module.exports = router;
