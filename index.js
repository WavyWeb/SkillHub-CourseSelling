const cookieParser = require("cookie-parser");
require('dotenv').config()
const { DB_NAME } = require("./config.js"); 
// console.log(process.env.MONGODB_URI)

const express = require("express");
const mongoose = require("mongoose");

const { userRouter } = require("./Routes/user");
const { courseRouter } = require("./Routes/course");
const {adminRouter } = require("./Routes/admin");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/course", courseRouter);

async function main() {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
    app.listen(5002);
    console.log("Listening to the server")
}

main()