const jwt = require("jsonwebtoken");
const { JWT_ADMIN_PASSWORD } = require("../config");
const { apiError } = require("../utils/apiError");

function adminMiddleware(req, res, next){
    const token = req.headers.token;
    if(!token) throw new apiError(401,"Token is missing access is denied")
   try {
     const decoded = jwt.verify(token, JWT_ADMIN_PASSWORD);
 
     if(decoded) {
         req.userId = decoded.indexOf;
         next()
     } 
     
   } catch (error) {
    throw new apiError(403, "Invalid token, access denied");
    
   }
}

module.exports = {
    adminMiddleware: adminMiddleware
}