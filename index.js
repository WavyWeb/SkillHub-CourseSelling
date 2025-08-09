require('dotenv').config();
const express = require("express");
const cookieParser = require("cookie-parser");
const connectToMongoDB = require("./config/mongodb");
const userRouter = require("./routes/user.route");
const adminRouter = require("./routes/admin.route");

const app = express();
const PORT = 8000;

app.use(express.json());
app.use(cookieParser());

app.use("/user", userRouter);
app.use("/admin", adminRouter);

connectToMongoDB()
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => {
      console.log(`🚀 Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

