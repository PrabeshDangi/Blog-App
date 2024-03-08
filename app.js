const cookieParser = require("cookie-parser");
const express = require("express");
const userRoutes = require("./Routes/userRoute");
const postRoutes = require("./Routes/postRoutes");
const app = express();

//Regular middlewares
app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true, limit: "20kb" }));
app.use(cookieParser());

//Importing routes
app.use("/blog/user", userRoutes);
app.use("/blog", postRoutes);

module.exports = app;
