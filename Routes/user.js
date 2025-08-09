const { Router } = require("express");
const jwt = require("jsonwebtoken");
const admin = require("firebase-admin");
const { JWT_USER_PASSWORD } = require("../config");
const { userModel, purchaseModel, courseModel } = require("../db");
const { userMiddleware } = require("../middleware/user");
const { apiError } = require("../utils/apiError");
const { apiResponse } = require("../utils/apiResponse");

const userRouter = Router();

userRouter.post("/signup", async (req, res, next) => {
  const { email, password, firstName, lastName } = req.body;
  try {
    await userModel.create({ email, password, firstName, lastName });
    res.json(new apiResponse(200, {}, "Signed Up successfully!"));
  } catch (e) {
    next(e);
  }
});

userRouter.post("/signin", async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new apiError(400, "Email and password required"));
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user || user.password !== password) {
      return next(new apiError(404, "User does not exist or wrong password"));
    }
    const token = jwt.sign({ id: user._id }, JWT_USER_PASSWORD, { expiresIn: "7d" });
    const loggedInUser = await userModel.findById(user._id).select("-password");

    res
      .status(200)
      .cookie("token", token, { httpOnly: true, secure: true })
      .json(new apiResponse(200, { user: loggedInUser, token }, "User logged in successfully!"));
  } catch (e) {
    next(e);
  }
});

// Google Sign-In
userRouter.post("/google-signin", async (req, res, next) => {
  const { idToken } = req.body;
  if (!idToken) return next(new apiError(400, "ID token is required"));

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { email, name } = decodedToken;
    let user = await userModel.findOne({ email });

    if (!user) {
      const [firstName, ...lastNameParts] = name.split(" ");
      const lastName = lastNameParts.join(" ") || "";
      user = await userModel.create({ email, firstName, lastName });
    }

    const token = jwt.sign({ id: user._id }, JWT_USER_PASSWORD, { expiresIn: "7d" });
    const loggedInUser = await userModel.findById(user._id).select("-password");

    res
      .status(200)
      .cookie("token", token, { httpOnly: true, secure: true })
      .json(new apiResponse(200, { user: loggedInUser, token }, "User logged in successfully with Google!"));
  } catch (e) {
    next(new apiError(401, "Invalid Google token or authentication failed"));
  }
});

userRouter.post("/logout", (req, res) => {
  res
    .clearCookie("token", { httpOnly: true, secure: true })
    .status(200)
    .json(new apiResponse(200, {}, "Logged Out Successfully!"));
});

userRouter.get("/purchases", userMiddleware, async (req, res, next) => {
  try {
    const userId = req.userId;
    const purchases = await purchaseModel.find({ userId });
    const purchasedCourseIds = purchases.map(p => p.courseId);
    const coursesData = await courseModel.find({ _id: { $in: purchasedCourseIds } });
    res.json(new apiResponse(200, { purchases, coursesData }, "Fetched successfully!"));
  } catch (e) {
    next(e);
  }
});

module.exports = userRouter;
