const mongoose = require('mongoose');

const mongoURI = "mongodb://127.0.0.1:27017/skillhub"; // Replace with MongoDB Atlas URI if using online DB

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected...");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
