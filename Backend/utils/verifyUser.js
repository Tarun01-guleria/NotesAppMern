import { errorHandler } from "./error.js";
import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  req.user = user;
  next();
  // const token = req.cookies.access_token;

  // if (!token) {
  //   return next(errorHandler(401, "Unauthorized"));
  // }

  // jwt.verify(token, "cdcsldfj", (err, user) => {
  //   if (err) {
  //     return next(errorHandler(403, "Forbidden"));
  //   }
  //   req.user = user;
  //   next();
  // });
};
