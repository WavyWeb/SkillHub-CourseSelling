const { Router } = require("express");
const userRouter = Router();
const jwt = require("jsonwebtoken");

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

  res.json({
    message: "signup succeeded",
  });
});

userRouter.post("/signin", async function (req, res) {
  const { email, password } = req.body;

  if (!password || !email) {
    throw new apiError(400, "password or email is required!");
  }

  // FUTURE: can use hashing for password

  const user = await userModel.findOne({
    $or: [{ email }, { password }],
  });

  if (!user || user.password !== password) {
    return new apiError(404, "User does not exists or wrong password!");
  } 

    const token = jwt.sign(
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
  }
);

userRouter.post("/logout", async (req, res)=>{
res
.clearCookie("token", {
    httpOnly: true,
    secure: true
})
return res
.status(200)
.json(
    new apiResponse(200, "Logged Out Succesfully!")
)
})

userRouter.get("/purchases", userMiddleware, async function (req, res) {
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

  res.json({
    purchases,
    coursesData,
  });
});

module.exports = {
  userRouter: userRouter,
};
