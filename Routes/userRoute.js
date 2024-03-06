const { Router } = require("express");
const router = Router();
const {
  registerUser,
  logInUser,
  logOutUser,
} = require("../Controllers/userController");

router.route("/signup").post(registerUser);
router.route("/login").post(logInUser);
router.route("/logout").post(logOutUser);

module.exports = router;
