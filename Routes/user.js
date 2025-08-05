const { Router } = require("express");
const userRouter = Router();
const jwt = require("jsonwebtoken");
const admin = require("firebase-admin");

// Make sure to initialize firebase-admin in your main index.js or app.js file
// You can download your service account key from the Firebase console
// admin.initializeApp({
//   credential: admin.credential.cert(require("./path/to/your/serviceAccountKey.json"))
// });

const { JWT_USER_PASSWORD } = require("../config");

const { userModel, purchaseModel, courseModel } = require("../db");
const { userMiddleware } = require("../middleware/user");
const { apiError } = require("../utils/apiError.js");
const { apiResponse } = require("../utils/apiResponse.js");

userRouter.post("/signup", async function (req, res) {
  const { email, password, firstName, lastName } = req.body;
  // FUTURE: adding zod validation and using hashing

  try {
    await userModel.create({
      email: email,
      password: password,
      firstName: firstName,
      lastName: lastName,
    });
  } catch (e) {
    console.log(e);
  }

  res.json(
    new apiResponse(200, {}, "Signed Up successfully!")
  );
});

userRouter.post("/signin", async function (req, res) {
  const { email, password } = req.body;

  if (!password || !email) {
    throw new apiError(400, "password or email is required!");
  }

  // FUTURE: can use hashing for password
  try {
      const user = await userModel.findOne({
      $or: [{ email }, { password }],
    });

    if (!user || user.password !== password) {
      return new apiError(404, "User does not exists or wrong password!");
    } 

      const token = await jwt.sign(
        {
          id: user._id,
        },
        JWT_USER_PASSWORD,
        { expiresIn: "7d"}
      );

      const loggedInUser = await userModel.findById(user._id).select("-password");

      res
      .status(200)
      .cookie("token", token, {
          httpOnly: true,
          secure: true
      })
      .json(
          new apiResponse(200, {
        user: loggedInUser,
        token: token,
      }, "User logged In successfully!")
      );
  } catch (error) {
    return new apiError(401, error.message) 
  }
});

// NEW: Route to handle Google Sign-In
userRouter.post("/google-signin", async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    throw new apiError(400, "ID token is required!");
  }

  try {
    // Verify the ID token with Firebase Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid, email, name } = decodedToken;

    let user = await userModel.findOne({ email });

    // If user doesn't exist, create a new one
    if (!user) {
      const [firstName, ...lastNameParts] = name.split(' ');
      const lastName = lastNameParts.join(' ') || ''; // Handle names without a last name

      user = await userModel.create({
        email,
        firstName,
        lastName,
        // Password is not required for Google Sign-In users
      });
    }

    // Generate a JWT for our application
    const token = jwt.sign(
      { id: user._id },
      JWT_USER_PASSWORD,
      { expiresIn: "7d" }
    );

    const loggedInUser = await userModel.findById(user._id).select("-password");

    res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
      })
      .json(
        new apiResponse(200, {
          user: loggedInUser,
          token: token,
        }, "User logged in successfully with Google!")
      );
  } catch (error) {
    console.error("Google Sign-In Error:", error);
    return new apiError(401, "Invalid Google token or authentication failed.");
  }
});


userRouter.post("/logout", async (req, res)=>{
  res
  .clearCookie("token", {
      httpOnly: true,
      secure: true
  })
  return res
  .status(200)
  .json(
      new apiResponse(200, {}, "Logged Out Succesfully!")
  )
})

userRouter.get("/purchases", userMiddleware, async function (req, res) {
  try {
        const userId = req.userId;

    const purchases = await purchaseModel.find({
      userId,
    });

    let purchasedCourseIds = [];

    for (let i = 0; i < purchases.length; i++) {
      purchasedCourseIds.push(purchases[i].courseId);
    }

    const coursesData = await courseModel.find({
      _id: { $in: purchasedCourseIds },
    });

    res.json(
      new apiResponse(200, {
      purchases,
      coursesData,
    }, "fetched successfully!")
    );
  } catch (error) {
      return new apiError(401, error.message)
  }
});

module.exports = {
  userRouter: userRouter,
};
