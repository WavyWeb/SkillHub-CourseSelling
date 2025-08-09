const jwt = require("jsonwebtoken");
const { JWT_USER_PASSWORD } = require("../config");
const { apiError } = require("../utils/apiError");

function userMiddleware(req, res, next) {
  const { token } = req.cookies;
  if (!token) return next(new apiError(401, "Token missing, access denied"));

  try {
    const decoded = jwt.verify(token, JWT_USER_PASSWORD);
    req.userId = decoded.id;
    next();
  } catch {
    next(new apiError(403, "Invalid token, access denied"));
  }
}

module.exports = { userMiddleware };
