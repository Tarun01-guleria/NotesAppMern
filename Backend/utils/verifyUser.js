import { errorHandler } from "./error.js";
import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  let token = req.cookies.access_token; // Try getting token from cookies

  if (!token) {
    // If token is not in cookies, try getting it from the Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1]; // Extract token from "Bearer <token>"
    }
  }

  if (!token) {
    return next(errorHandler(401, "Unauthorized"));
  }

  jwt.verify(token, "cdcsldfj", (err, user) => {
    if (err) {
      return next(errorHandler(403, "Forbidden"));
    }
    req.user = user;
    next();
  });
};
