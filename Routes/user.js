// Routes/user.js (Updated with combined features)
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const helmet = require('helmet');
const admin = require("firebase-admin"); // for Google Sign-In

// Make sure to initialize firebase-admin in your main index.js or app.js file
// admin.initializeApp({
//   credential: admin.credential.cert(require("./path/to/your/serviceAccountKey.json"))
// });

const { userModel, purchaseModel, courseModel } = require("../db");
const { userMiddleware } = require("../middleware/user");
const { apiError } = require("../utils/apiError.js");
const { apiResponse } = require("../utils/apiResponse.js");
const { JWT_USER_PASSWORD } = require("../config"); // Your JWT secret from config

// Import rate limiting middleware (assuming these exist)
const {
  loginRateLimit,
  registrationRateLimit,
  passwordResetRateLimit,
  emailVerificationRateLimit,
  progressiveLoginRateLimit
} = require('../middleware/rateLimiting'); // Adjust path as needed

// Apply helmet for basic security headers
router.use(helmet());

// Input validation middleware for login
const validateLoginInput = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !validator.isEmail(email)) {
    return res.status(400).json(new apiError(400, 'Please provide a valid email address'));
  }
  if (!password || password.length < 6) {
    return res.status(400).json(new apiError(400, 'Password must be at least 6 characters long'));
  }
  req.body.email = validator.normalizeEmail(email);
  next();
};

// Input validation middleware for registration
const validateRegistrationInput = (req, res, next) => {
  const { email, password, firstName, lastName } = req.body;
  
  if (!email || !validator.isEmail(email)) {
    return res.status(400).json(new apiError(400, 'Please provide a valid email address'));
  }
  
  if (!password || password.length < 8) {
    return res.status(400).json(new apiError(400, 'Password must be at least 8 characters long'));
  }
  
  if (!firstName || firstName.trim().length < 2) {
    return res.status(400).json(new apiError(400, 'First name must be at least 2 characters long'));
  }
  
  // Additional password strength check
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json(new apiError(400, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'));
  }
  
  // Sanitize inputs
  req.body.email = validator.normalizeEmail(email);
  req.body.firstName = validator.escape(firstName.trim());
  if (lastName) {
      req.body.lastName = validator.escape(lastName.trim());
  }
  
  next();
};

// =====================================================================
//                       Authentication Endpoints
// =====================================================================

// User registration with security best practices
router.post("/signup",
  registrationRateLimit,
  validateRegistrationInput,
  async (req, res) => {
    try {
      const { email, password, firstName, lastName } = req.body;

      // Check if user already exists
      const existingUser = await userModel.findOne({ email });
      if (existingUser) {
        return res.status(409).json(new apiError(409, 'User with this email already exists'));
      }

      // Hash password
      const saltRounds = 10; // Use a reasonable salt round count
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create new user
      const user = await userModel.create({
        email,
        password: hashedPassword,
        firstName,
        lastName,
      });

      // Generate JWT for direct login after registration
      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_USER_PASSWORD || JWT_USER_PASSWORD, // Use a consistent secret key
        { expiresIn: "7d" }
      );
      
      const createdUser = await userModel.findById(user._id).select("-password");

      res.status(201)
         .cookie("token", token, { httpOnly: true, secure: true })
         .json(new apiResponse(201, { user: createdUser, token }, "Signed Up successfully!"));

    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json(new apiError(500, 'An internal server error occurred'));
    }
});

// User signin with security best practices
router.post("/signin",
  progressiveLoginRateLimit,
  validateLoginInput,
  async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await userModel.findOne({ email });

      if (!user) {
        return res.status(401).json(new apiError(401, 'Invalid credentials'));
      }

      // First, try to compare with bcrypt
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        // If bcrypt fails, check if the stored password is plain text
        if (user.password === password) {
          console.log("Updating plain-text password to hash for user:", user.email);
          const saltRounds = 10;
          const hashedPassword = await bcrypt.hash(password, saltRounds);
          await userModel.findByIdAndUpdate(user._id, { password: hashedPassword });
          // Now the password is correct, and we can proceed.
        } else {
          // If it's not a bcrypt hash and not a plain-text password, it's an invalid credential
          return res.status(401).json(new apiError(401, 'Invalid credentials'));
        }
      }
      
      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_USER_PASSWORD || JWT_USER_PASSWORD,
        { expiresIn: "7d" }
      );

      const loggedInUser = await userModel.findById(user._id).select("-password");

      res.status(200)
        .cookie("token", token, { httpOnly: true, secure: true })
        .json(new apiResponse(200, { user: loggedInUser, token }, "User logged in successfully!"));

    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json(new apiError(500, 'An internal server error occurred'));
    }
});

// Google Sign-In endpoint
router.post("/google-signin", async (req, res) => {
    const { idToken } = req.body;
    if (!idToken) {
        return res.status(400).json(new apiError(400, "ID token is required!"));
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const { uid, email, name } = decodedToken;
        let user = await userModel.findOne({ email });

        if (!user) {
            const [firstName, ...lastNameParts] = (name || " ").split(' ');
            const lastName = lastNameParts.join(' ') || '';

            user = await userModel.create({
                email,
                firstName,
                lastName,
                // Password is not required for Google Sign-In users
                password: "" // Store a default empty password or handle as per your schema
            });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_USER_PASSWORD || JWT_USER_PASSWORD,
            { expiresIn: "7d" }
        );

        const loggedInUser = await userModel.findById(user._id).select("-password");

        res.status(200)
            .cookie("token", token, { httpOnly: true, secure: true, sameSite: 'None' })
            .json(new apiResponse(200, { user: loggedInUser, token }, "User logged in successfully with Google!"));
    } catch (error) {
        console.error("Google Sign-In Error:", error);
        return res.status(401).json(new apiError(401, "Invalid Google token or authentication failed."));
    }
});

router.post("/logout", async (req, res) => {
    res.clearCookie("token", { httpOnly: true, secure: true });
    return res.status(200).json(new apiResponse(200, {}, "Logged Out Successfully!"));
});

// =====================================================================
//                        User-Specific Endpoints
// =====================================================================

router.get("/purchases", userMiddleware, async function (req, res) {
  try {
    const userId = req.userId;
    const purchases = await purchaseModel.find({ userId });
    const purchasedCourseIds = purchases.map(purchase => purchase.courseId);

    const coursesData = await courseModel.find({ _id: { $in: purchasedCourseIds } });

    res.json(new apiResponse(200, {
      purchases,
      coursesData,
    }, "Fetched successfully!"));
  } catch (error) {
    console.error("Purchases fetch error:", error);
    return res.status(500).json(new apiError(500, "Failed to fetch purchases"));
  }
});

// Export the router
module.exports = {
  userRouter: router,
};
