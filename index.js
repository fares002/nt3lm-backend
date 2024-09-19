const express = require("express");
const app = express();
const cors = require("cors");

const httpStatusText = require("./utils/httpStatusText");
const path = require("path");
const port = 5000;
require("dotenv").config();
const courseRouter = require("./routes/coursesRoute");
const userRouter = require("./routes/userRoute");
const uri = process.env.MONGOURL;
const mongoose = require("mongoose");
mongoose.connect(uri).then(() => {
  console.log("mongodb connected succesfully");
});

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/v1/courses", courseRouter);
app.use("/api/v1/users", userRouter);
//global middaleware for not found router
app.all("*", (req, res) => {
  return res
    .status(404)
    .json({
      status: httpStatusText.ERROR,
      message: "This resource not available",
    });
});
//global error handler
app.use((error, req, res, next) => {
  res
    .status(error.statusCode || 500)
    .json({
      status: error.statusText || httpStatusText.ERROR,
      message: error.message,
      code: error.statusCode,
    });
});

app.listen(port, () => {
  console.log(`Express app is runinng in port ${port}`);
});
