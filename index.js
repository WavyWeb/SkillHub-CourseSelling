// Load environment variables first
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { generalApiRateLimit } = require('./middleware/rateLimiting');
const { userRouter } = require("./Routes/user");
const { courseRouter } = require("./Routes/course");
const { adminRouter } = require("./Routes/admin");
const paymentRouter = require("./Routes/payment.js");

const app = express();
const PORT = 5002;

// Middleware setup
//
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

// Apply general API rate limiting to all /api/ routes
app.use('/api/v1', generalApiRateLimit);

// Your API routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/course", courseRouter);
app.use("/api/v1/payment", paymentRouter);

async function main() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB Atlas successfully!");
    
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });

  } catch (error) {
    console.error("Failed to connect to the database or start the server:", error);
    process.exit(1);
  }
}

main();
