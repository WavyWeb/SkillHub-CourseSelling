require('dotenv').config();
const express = require("express");
const cookieParser = require("cookie-parser");
const admin = require("firebase-admin");
const connectToMongoDB = require("./config/mongodb");

const userRouter = require('./Routes/user');
const adminRouter = require('./Routes/admin');

const app = express();
const PORT = 8000;

// Initialize Firebase Admin SDK
const serviceAccount = require("./path/to/serviceAccountKey.json"); // <-- add your path here
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

app.use(express.json());
app.use(cookieParser());

app.use("/user", userRouter);
app.use("/admin", adminRouter);

// Error handler middleware
app.use((err, req, res, next) => {
  console.error(err);
  if (err.statusCode) {
    return res.status(err.statusCode).json({ message: err.message });
  }
  res.status(500).json({ message: "Internal Server Error" });
});

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
