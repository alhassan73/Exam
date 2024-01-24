import userModel from "../../db/model/user.model.js";
import AppError from "../utils/appErrors.js";
import jwt from "jsonwebtoken";

const auth = () => {
  return async (req, res, next) => {
    const { token } = req.headers;
    if (!token) {
      return res.status(404).json({ message: "token not found" });
    }
    if (!token.startsWith(process.env.BEARER_KEY)) {
      return res.status(400).json({ message: "invalid Token" });
    }
    const baseToken = token.split(process.env.BEARER_KEY)[1];
    const decoded = jwt.verify(baseToken, process.env.SIGNATURE);
    if (!decoded) {
      return res.status(400).json({ message: "invalid signature" });
    }
    if (!decoded.id) {
      return res.status(400).json({ message: "invalid token payload" });
    }
    if (decoded.exp >= new Date().getTime()) {
      return res.status(401).json({ message: "Token Expired" });
    }
    const user = await userModel.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    req.user = user;
    next();
  };
};

export default auth;
