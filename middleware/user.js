const jwt = require("jsonwebtoken");
const { JWT_USER_PASSWORD } = require("../config");
const { apiError } = require("../utils/apiError");

function userMiddleware(req, res, next){
    //const token = req.headers.token;
    const {token} = req.cookies;
    
   if (!token) {
    throw new apiError(401, "Token missing, access denied");
  }
  
  try{

    const decoded = jwt.verify(token, JWT_USER_PASSWORD);

    if (decoded) {
      req.userId = decoded.indexOf;
      next();
    }
  } catch (error) {
    throw new apiError(403, "Invalid token, access denied");
  }
}

module.exports = {
  userMiddleware: userMiddleware,
};
