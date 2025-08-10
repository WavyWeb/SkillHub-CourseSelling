const jwt = require("jsonwebtoken");
const { JWT_USER_PASSWORD } = require("../config");
const { apiError } = require("../utils/apiError");

function userMiddleware(req, res, next){
    //const token = req.headers.token;
try {
      const {token} = req.cookies;
      
     if (!token) {
      throw new apiError(401, "Token missing, access denied");
    }
  
    
      const decoded = jwt.verify(token, JWT_USER_PASSWORD);
      if (!decoded || !decoded.id) {
        throw new apiError(403, "Invalid or expired token.");
      }
  
      req.userId = decoded.id; 
      next();
   
} catch (error) {
   if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
      return next(new apiError(403, "Invalid or expired token."));
    }
    next(err);
  }
}

module.exports = {
  userMiddleware: userMiddleware,
};
