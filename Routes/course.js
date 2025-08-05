const { Router } = require("express");
const courseRouter = Router();
const { userMiddleware } = require("../middleware/user");
const { purchaseModel, courseModel } = require("../db");
const { apiError } = require("../utils/apiError");
const { apiResponse } = require("../utils/apiResponse");

courseRouter.post("/purchase", userMiddleware, async function(req, res) {
    const userId = req.userId;
    const courseId = req.body.courseId;

    try {
    // should check that the user has actually paid the price
        await purchaseModel.create({
            userId,
            courseId
        });

        return res.status(200).json(
            new apiResponse(200, {}, "You have successfully bought the course")
        );
    } catch (error) {
        throw new apiError(500, "Could not process purchase");
    }
});

courseRouter.get("/preview", async function(req, res) {
    try {
        const courses = await courseModel.find({});
        if (!courses || courses.length === 0) {
            throw new apiError(404, "No course to preview");
        }

        return res.status(200).json(
            new apiResponse(200, { courses }, "Fetched successfully")
        );
    } catch (error) {
        throw new apiError(500, error.message || "Something went wrong while fetching courses");
    }
});

module.exports = {
    courseRouter: courseRouter
};
