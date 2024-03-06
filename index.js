const { default: mongoose } = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const app = require("./app");

app.on("error", (e) => {
  console.error("Error:", e);
  throw error;
});

// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.DATABASE_URL);
//     console.log("Database connected successfully!!");
//     // console.log("Connection Instance:", connectionIns);
//   } catch (error) {
//     console.log("Database connection error.");
//     process.exit(1);
//   }
// };

// connectDB();

try {
  app.listen(process.env.PORT, () => {
    console.log(`Server started at port ${process.env.PORT}`);
  });
} catch (error) {
  console.log("Error cennecting to the server!!");
}
