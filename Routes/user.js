const { Router} = require("express");
const userRouter = Router();
const jwt = require("jsonwebtoken");

const {JWT_USER_PASSWORD } = require("../config");

const { userModel, purchaseModel, courseModel } = require("../db");
const { userMiddleware } = require("../middleware/user");


userRouter.post("/signup", async function(req, res){
    const { email, password, firstName, lastName } = req.body;
    // FUTURE: adding zod validation and using hashing

    try{
        await userModel.create({
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
    
userRouter.post("/signin", async function(req, res){
    const {email, password } = req.body;

    // FUTURE: can use hashing for password
    const user = await userModel.findOne({
        email: email,
        password: password
    });

    if (user) {
        const token = jwt.sign({
            id: user._id 
        }, JWT_USER_PASSWORD);


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
    
userRouter.get("/purchases", userMiddleware, async function(req, res){
    const userId = req.userId;

    const purchases = await purchaseModel.find({
        userId,
    });

    let purchasedCourseIds = [];

    for (let i = 0; i<purchases.length;i++){ 
        purchasedCourseIds.push(purchases[i].courseId)
    }

    const coursesData = await courseModel.find({
        _id: { $in: purchasedCourseIds }
    })

    res.json({
        purchases,
        coursesData
    })
})


module.exports = {
    userRouter: userRouter
}