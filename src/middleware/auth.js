import AppError from "../utils/appErrors.js";
import jwt from "jsonwebtoken";

const auth = () => {
  return (req, res, next) => {
    const { token } = req.headers;
    if (!token) {
      return next(new AppError("Invalid token", 400));
    }
    if (!token.startsWith(process.env.BEARER_KEY)) {
      return next(new AppError("Invalid Bearer Token", 400));
    }
    const baseToken = token.split(process.env.BEARER_KEY)[1];

    const decodedToken = jwt.verify(baseToken, process.env.SIGNATURE);

    if (!decodedToken) {
      return next(new AppError("Token Not Valid", 400));
    }
    if (!decodedToken.id) {
      return next(new AppError("Invalid Token"), 400);
    }
    req.user = decodedToken;
    next();
  };
};

export default auth;
