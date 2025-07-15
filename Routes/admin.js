const { Router } = require("express");
const adminRouter = Router();
const jwt = require("jsonwebtoken");

const { JWT_ADMIN_PASSWORD } = require("../config");

const { adminModel, courseModel } = require("../db");
const { adminMiddleware } = require("../middleware/admin");


adminRouter.post("/signup", async function(req, res){
    const { email, password, firstName, lastName } = req.body;
    // FUTURE: adding zod validation and using hashing

    try{
        await adminModel.create({
            email: email,
            password: password,
            firstName: firstName,
            lastName: lastName
        })
    }catch(e){
        console.log(e);
    }   
    res.json({
        message: "signup succeeded"
    })
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


        // FUTURE: can do cookie logic here
        res.json({
            token: token
        })
    } else {
        res.status(403).json({
            message: "Incorrect credentials"
        })
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
    res.json({
        message: "course created",
        courseId: course._id
    })
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
    res.json({
        message: "course updated",
        courseId: course._id
    })
})

adminRouter.get("/course/bulk", adminMiddleware, async function(req, res){
    const adminId = req.userId;

    
    const courses = await courseModel.find({
        creatorId: adminId
    })
    res.json({
        message: "course updated",
        courses
    })    
})

module.exports = {
    adminRouter: adminRouter
}