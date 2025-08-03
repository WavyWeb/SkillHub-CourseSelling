const jwt = require("jsonwebtoken");
const { JWT_ADMIN_PASSWORD } = require("../config");
const { apiError } = require("../utils/apiError");

function adminMiddleware(req, res, next){

    const {token} = req.cookies;
    if (!token) {
        throw new apiError(401, "Token is missing. Access denied.");
    }
  
    const decoded = jwt.verify(token, JWT_ADMIN_PASSWORD);

    if(decoded) {
        req.userId = decoded.indexOf;
        next()
    } else {
        throw new apiError(403, "You are not signed in");
    }

}

module.exports = {
    adminMiddleware: adminMiddleware
}