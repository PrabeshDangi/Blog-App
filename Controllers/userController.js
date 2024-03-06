const asyncHandler = require("express-async-handler");
const prisma = require("../prisma/index");
const bcrypt = require("bcrypt");
const sendtoken = require("../utils/sendAuthToken");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  //Check is any of required field is empty or not.
  if ([name, email, password].some((field) => field?.trim() === "")) {
    res.status(400);
    throw new Error("All the fields are required!!");
  }

  //check if email is already registered or not
  const availableuser = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (availableuser) {
    res.status(400);
    throw new Error("User already exists!!");
  }

  //Encrypting the password.
  const encryptedPw = await bcrypt.hash(password, 10);
  //console.log(encryptedPw);

  const newuser = await prisma.user.create({
    data: {
      name: name,
      email: email,
      password: encryptedPw,
    },
  });

  //frontend ma password field bahek baki field haru dekhauna ko lagi..
  const createdUser = await prisma.user.findUnique({
    where: {
      id: newuser.id,
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  return res.status(200).json({
    message: "User registered Successfully",
    createdUser,
  });
});

//Login

const logInUser = asyncHandler(async (req, res) => {
  //take email, pw
  //check if any of fields are empty
  //check if user exists or not using email
  //

  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide the email and password!");
  }

  const userAvailable = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!userAvailable) {
    res.status(404);
    throw new Error("Provide valid email and password.");
  }

  const isValidPW = await bcrypt.compare(password, userAvailable.password);

  if (!isValidPW) {
    res.status(400);
    throw new Error("Invalid password!!");
  }
  console.log(userAvailable);
  //yedi sabai credentials haru correct chha vane, token pathaune client lai.
  sendtoken(userAvailable, 200, res);
});

//Logout User
const logOutUser = asyncHandler(async (req, res) => {
  try {
    res.clearCookie("token");

    return res.status(200).json({
      message: "User logged out successfully!!",
    });
  } catch (error) {
    res.status(400);
    throw new Error("Invalid Attempt!!");
  }
});

module.exports = {
  registerUser,
  logInUser,
  logOutUser,
};
