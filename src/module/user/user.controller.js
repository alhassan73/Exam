import userModel from "../../../db/model/user.model.js";
import AppError, { asyncHandler } from "../../utils/appErrors.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
/* -------------------------------------------------------------------------- */
/*                                   signUp                                   */
/* -------------------------------------------------------------------------- */
export const signUp = asyncHandler(async (req, res, next) => {
  let {
    firstName,
    lastName,
    email,
    password,
    mobile,
    dob,
    recoveryEmail,
    role,
  } = req.body;
  const exist = await userModel.findOne({ $or: [{ email }, { mobile }] });
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
    dob,
    recoveryEmail,
    role,
  });
  user
    ? res.status(200).json({ message: "done", user })
    : next(AppError("Sign Up Failed", 500));
});
/* -------------------------------------------------------------------------- */
/*                                   signIn                                   */
/* -------------------------------------------------------------------------- */
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
      id: user._id,
      email: user.email,
      role: user.role,
    },
    process.env.SIGNATURE
  );
  user
    ? res.status(200).json({ message: "Done", token })
    : next(new AppError("Sign in failed", 500));
});
/* -------------------------------------------------------------------------- */
/*                      update user data with conditions                      */
/* -------------------------------------------------------------------------- */
export const updateUser = asyncHandler(async (req, res, next) => {
  const { email, mobile, recoveryEmail, dob, firstName, lastName, userName } =
    req.body;
  const user = await userModel.findById(req.user._id);
  if (!user) {
    return next(new AppError("user not found", 404));
  }
  if (firstName) {
    user.firstName = firstName;
  }
  if (lastName) {
    user.lastName = lastName;
  }
  user.userName = `${user.firstName} ${user.lastName}`;
  if (userName) {
    user.userName = userName;
  }

  if (email || mobile) {
    const exist = await userModel.findOne({ $or: [{ email }, { mobile }] });
    if (exist) {
      return exist.email === user.email || exist.mobile === user.mobile
        ? next(new AppError("provided email or phone are your current"), 400)
        : next(
            new AppError("provided email or phone are used by another user"),
            400
          );
    }
    if (email) {
      user.email = email;
    }
    if (mobile) {
      user.mobile = mobile;
    }
  }
  if (dob) {
    user.dob = dob;
  }
  if (recoveryEmail) {
    user.recoveryEmail = recoveryEmail;
  }
  await user.save();
  return res.status(200).json({ msg: "done", user });
});

/* -------------------------------------------------------------------------- */
/*                             delete user if auth                            */
/* -------------------------------------------------------------------------- */
export const deleteUser = asyncHandler(async (req, res, next) => {
  const user = await userModel.findByIdAndDelete(req.user._id);
  if (!user) {
    return next(new AppError("user not found or not logged in", 404));
  }
  return res.status(200).json({ msg: "deleted" });
});
/* -------------------------------------------------------------------------- */
/*                            get user data if auth                           */
/* -------------------------------------------------------------------------- */
export const getUser = asyncHandler(async (req, res, next) => {
  const user = await userModel.findById(req.user._id);
  if (!user) {
    return next(new AppError("user not found or not logged in", 404));
  }
  return res.status(200).json({ msg: "done", user });
});
/* -------------------------------------------------------------------------- */
/*                  get any user data using userid in params                  */
/* -------------------------------------------------------------------------- */
export const getAnyUserById = asyncHandler(async (req, res, next) => {
  const user = await userModel.findById(req.params.id);
  if (!user) {
    return next(new AppError("user not found", 404));
  }
  return res.status(200).json({ msg: "done", user });
});
/* -------------------------------------------------------------------------- */
/*                                 update user                                */
/* -------------------------------------------------------------------------- */
export const updatePassword = asyncHandler(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  const user = await userModel.findById(req.user._id);
  if (!user) {
    return next(new AppError("user not found or not logged in", 404));
  }
  const match = bcrypt.compareSync(oldPassword, user.password);
  if (!match) {
    return next(new AppError("password does not match your current", 400));
  }
  const hash = bcrypt.hashSync(newPassword, +process.env.SALT_ROUND);
  user.password = hash;
  await user.save();
  return res.status(200).json({ msg: "done" });
});
/* -------------------------------------------------------------------------- */
/*                     generate otp for forgeting password                    */
/* -------------------------------------------------------------------------- */
export const forgetPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) {
    return next(new AppError("User not found. Please sign up.", 404));
  }
  // Generate an OTP
  const otp = crypto.randomBytes(4).toString("hex"); // 4 digits OTP
  const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes expiry
  const hashedOtp = bcrypt.hashSync(otp, +process.env.SALT_ROUND);
  user.otp = hashedOtp;
  user.otpExpiry = otpExpiry;
  await user.save();
  return res.status(200).json({ message: "done OTP generated", otp });
});
/* -------------------------------------------------------------------------- */
/*          reseting password after making otp as addtional endpoint          */
/* -------------------------------------------------------------------------- */
export const resetPassword = asyncHandler(async (req, res, next) => {
  const { email, otp, newPassword } = req.body;
  const user = await userModel.findOne({ email });
  if (
    !user ||
    !user.otp ||
    !bcrypt.compareSync(otp, user.otp) ||
    Date.now() > user.otpExpiry
  ) {
    return next(new AppError("Invalid or expired OTP", 400));
  }

  const hash = bcrypt.hashSync(newPassword, +process.env.SALT_ROUND);
  user.password = hash;
  user.otp = "";
  user.otpExpiry = null;
  await user.save();

  return res.status(200).json({ message: "done" });
});

/* -------------------------------------------------------------------------- */
/*                         getAccountsByRecoveryEmail                         */
/* -------------------------------------------------------------------------- */
export const getAccountsByRecoveryEmail = asyncHandler(
  async (req, res, next) => {
    const { recoveryEmail } = req.body;

    const accounts = await userModel.find({ recoveryEmail });

    if (accounts.length === 0) {
      return next(
        new AppError("No accounts found with the provided recovery email", 404)
      );
    }

    return res.status(200).json({ accounts });
  }
);
