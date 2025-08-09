const { Router } = require("express");
const jwt = require("jsonwebtoken");
const { JWT_ADMIN_PASSWORD } = require("../config");
const { adminModel, courseModel } = require("../db");
const { adminMiddleware } = require("../middleware/admin");
const { apiError } = require("../utils/apiError");
const { apiResponse } = require("../utils/apiResponse");

const adminRouter = Router();

adminRouter.post("/signup", async (req, res, next) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    if (!email || !password || !firstName || !lastName) {
      return next(new apiError(400, "All fields are required"));
    }
    const existingUser = await adminModel.findOne({ email });
    if (existingUser) return next(new apiError(409, "User already exists."));
    
    await adminModel.create({ email, password, firstName, lastName });
    res.status(201).json(new apiResponse(201, {}, "Signup succeeded"));
  } catch (e) {
    next(e);
  }
});

adminRouter.post("/signin", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const admin = await adminModel.findOne({ email, password });
    if (!admin) return next(new apiError(403, "Incorrect credentials"));

    const token = jwt.sign({ id: admin._id }, JWT_ADMIN_PASSWORD);
    res.cookie("token", token, { httpOnly: true, secure: true });
    res.json(new apiResponse(200, { token }, "Admin signed in successfully"));
  } catch (e) {
    next(e);
  }
});

adminRouter.post("/course", adminMiddleware, async (req, res, next) => {
  try {
    const adminId = req.userId;
    const { title, description, price, imageUrl } = req.body;

    const course = await courseModel.create({
      title, description, price, imageUrl, creatorId: adminId,
    });
    res.json(new apiResponse(201, { courseId: course._id }, "Course created"));
  } catch (e) {
    next(e);
  }
});

adminRouter.put("/course", adminMiddleware, async (req, res, next) => {
  try {
    const adminId = req.userId;
    const { title, description, price, imageUrl, courseId } = req.body;

    const course = await courseModel.updateOne(
      { _id: courseId, creatorId: adminId },
      { title, description, price, imageUrl, creatorId: adminId }
    );
    if (!course) return next(new apiError(404, "Course not found or unauthorized"));
    res.json(new apiResponse(200, { courseId }, "Course updated"));
  } catch (e) {
    next(e);
  }
});

adminRouter.get("/course/bulk", adminMiddleware, async (req, res, next) => {
  try {
    const adminId = req.userId;
    const courses = await courseModel.find({ creatorId: adminId });
    res.json(new apiResponse(200, { courses }, "Courses fetched successfully"));
  } catch (e) {
    next(e);
  }
});

module.exports = adminRouter;
