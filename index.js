const cookieParser = require("cookie-parser");
require("dotenv").config();
const { DB_NAME } = require("./config.js");

const express = require("express");
const mongoose = require("mongoose");

const { userRouter } = require("./Routes/user");
const { courseRouter } = require("./Routes/course");
const { adminRouter } = require("./Routes/admin");
const paymentRouter = require("./Routes/payment.js");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173", // your frontend
    credentials: true,
  })
);

app.use("/api/v1/user", userRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/course", courseRouter);
app.use("/api/v1/payment", paymentRouter);

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  app.listen(5002);
  console.log("Listening to the server on port 5002");
}

main();
