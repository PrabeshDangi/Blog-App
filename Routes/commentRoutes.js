const Router = require("express");
const router = Router();
const verifyJWT = require("../Middlewares/authentication.Middleware");

const {
  getAllComments,
  createComment,
  updateComment,
  deleteComment,
} = require("../Controllers/commentController");

router.route("/createcomment/:id").post(verifyJWT, createComment);
router.route("/getcomment/:id").get(getAllComments);
router.route("/updatecomment/:id").post(updateComment);
router.route("/deletecomment/:id").post(deleteComment);

module.exports = router;
