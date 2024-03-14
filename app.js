const cookieParser = require("cookie-parser");
const express = require("express");
const userRoutes = require("./Routes/userRoute");
const postRoutes = require("./Routes/postRoutes");
const commentRoutes = require("./Routes/commentRoutes");
const upload = require("./Middlewares/multer");
const app = express();

//Regular middlewares
app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true, limit: "20kb" }));
app.use(upload.none()); //This parse form data with no files...
app.use(express.static("Public"));
app.use(cookieParser());

//Importing routes
app.use("/blog/user", userRoutes);
app.use("/blog", postRoutes);
app.use("/comment", commentRoutes);

module.exports = app;
