import userModel from "../../db/model/user.model.js";
import AppError from "../utils/appErrors.js";
import jwt from "jsonwebtoken";

export const validRoles = {
  HR: ["Company_HR"],
  User: ["User"],
};

const auth = (roles = []) => {
  return async (req, res, next) => {
    const { token } = req.headers;
    if (!token) {
      return res.status(404).json({ message: "Token not found" });
    }
    if (!token.startsWith(process.env.BEARER_KEY)) {
      return res.status(400).json({ message: "Invalid Token" });
    }
    const baseToken = token.split(process.env.BEARER_KEY)[1];
    const decoded = jwt.verify(baseToken, process.env.SIGNATURE);
    if (!decoded) {
      return res.status(400).json({ message: "Invalid signature" });
    }
    if (!decoded.id) {
      return res.status(400).json({ message: "Invalid token payload" });
    }
    if (decoded.exp >= new Date().getTime()) {
      return res.status(401).json({ message: "Token Expired" });
    }
    const user = await userModel.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.status === "Offline") {
      return res.status(400).json({ message: "Please login first" });
    }
    if (!roles.includes(user.role)) {
      return res.status(400).json({ message: "You're Not Authorized" });
    }
    req.user = user;
    next();
  };
};

export default auth;
