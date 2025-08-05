const { Router } = require("express");
const adminRouter = Router();
const jwt = require("jsonwebtoken");
const {apiError}=require('../utils/apiError.js');
const {apiResponse}=require('../utils/apiResponse.js');


const { JWT_ADMIN_PASSWORD } = require("../config");

const { adminModel, courseModel } = require("../db");
const { adminMiddleware } = require("../middleware/admin");


adminRouter.post("/signup", async function(req, res){
     // FUTURE: adding zod validation and using hashing


     const { email, password, firstName, lastName } = req.body;
     if (!email || !password || !firstName || !lastName) {
      throw new apiError(400, "All fields are required");
    }
    const existingUser=await adminModel.findOne({email});
    if(existingUser){
        throw new apiError(409,"User already exists.")
    }
    const adminObject={
        email,
        password,
        firstName,
        lastName
    };
    const admin=await adminModel.create(adminObject);
   return res.status(201).json(new apiResponse(201, {}, "Signup succeeded"));

    
})

adminRouter.post("/signin", async function(req, res){
    const {email, password } = req.body;

    // FUTURE: can use hashing for password
    const admin = await adminModel.findOne({
        email: email,
        password: password
    });
    
    if (admin) {
        const token = jwt.sign({
            id: admin._id 
        }, JWT_ADMIN_PASSWORD);

       
      res.cookie("token", token, {
            httpOnly: true,
            secure: true 
        });

        
        return res.json(new apiResponse(200, {
            token: token
        }, "Admin signed in successfully"));
    } else {
        throw new apiError(403, "Incorrect credentials");

    }
})

adminRouter.post("/course", adminMiddleware, async function(req, res){
    const adminId = req.userId;

    const { title, description, price, imageUrl } = req.body;

    const course = await courseModel.create({
        title: title, 
        description: description, 
        imageUrl: imageUrl, 
        price: price, 
        creatorId: adminId
    })
   return res.json(new apiResponse(201, { courseId: course._id }, "Course created"));

})

adminRouter.put("/course", adminMiddleware, async function(req, res){
    const adminId = req.userId;

    const { title, description, price, imageUrl, courseId } = req.body;

    const course = await courseModel.updateOne({
        _id: courseId,
        creatorId: adminId
    }, {
        title: title, 
        description: description, 
        imageUrl: imageUrl, 
        price: price, 
        creatorId: adminId
    })
    if(!course){
        throw new apiError(404,"Course not found or unauthorized")
    }
   return  res.json(new apiResponse(200, { courseId: course._id }, "Course updated"));

})

adminRouter.get("/course/bulk", adminMiddleware, async function(req, res){
    const adminId = req.userId;

    
    const courses = await courseModel.find({
        creatorId: adminId
    })
   return res.json(new apiResponse(200, { courses }, "Courses fetched successfully"));
  
})



module.exports = {
    adminRouter: adminRouter
}