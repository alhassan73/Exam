import userModel from "../../../db/model/user.model.js";
import AppError, { asyncHandler } from "../../utils/appErrors.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signUp = asyncHandler(async (req, res, next) => {
  let { firstName, lastName, email, password, mobile } = req.body;
  const exist = await userModel.findOne({ email });
  if (exist) {
    return next(new AppError("user already Exists"), 409);
  }
  const hash = bcrypt.hashSync(password, +process.env.SALT_ROUND);
  const user = await userModel.create({
    firstName,
    lastName,
    email,
    password: hash,
    mobile,
  });
  user
    ? res.json({ message: "done", user })
    : next(AppError("Sign Up Failed", 500));
});
export const signIn = asyncHandler(async (req, res, next) => {
  let { email, password, mobile } = req.body;
  const user = await userModel.findOne({ $or: [{ email }, { mobile }] });

  if (!user) {
    return next(new AppError("User not found. Please sign up.", 404));
  }

  const match = bcrypt.compareSync(password, user.password);

  if (!match) {
    return next(new AppError("Password does not match", 400));
  }

  user.status = "Online";
  await user.save();
  const token = jwt.sign(
    {
      userId: user._id,
      email: user.email,
      role: user.role,
    },
    process.env.SIGNATURE
  );

  user
    ? res.json({ message: "Done", token })
    : next(new AppError("Sign in failed", 500));
});
