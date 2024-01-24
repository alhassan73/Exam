import userModel from "../../../db/model/user.model.js";
import bcrypt from "bcrypt";
import AppError, { asyncHandler } from "../../utils/appErrors.js";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";

//***********************************SignUp***************************************
export const signUp = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, email, password, mobile, DOB } = req.body;
  const exist = await userModel.findOne({ $or: [{ email }, { mobile }] });

  if (exist) {
    return next(new AppError("Email or Phone Already Exists"), 400);
  }

  const hashPassword = bcrypt.hashSync(password, +process.env.SALT_ROUND);

  const user = new userModel({
    firstName,
    lastName,
    email,
    password: hashPassword,
    mobile,
    DOB,
  });

  await user.save();
  return res.status(201).json({ message: "User saved successfully" });
});

//***********************************SignIn***************************************

export const signIn = asyncHandler(async (req, res, next) => {
  const { email, mobile, password } = req.body;
  const user = await userModel.findOne({ $or: [{ email }, { mobile }] });
  if (!user) {
    return next(new AppError("User not Found", 404));
  }
  const match = bcrypt.compareSync(password, user.password);

  if (!match) {
    return next(new AppError("Password not Correct", 400));
  }

  const token = jwt.sign(
    { email: user.email, id: user._id },
    process.env.SIGNATURE
  );

  user.status = "Online";
  await user.save();
  return res.status(200).json({ message: "Login successful", token });
});

//***********************************update***************************************

export const updateUser = asyncHandler(async (req, res, next) => {
  const { email, mobile, recoveryEmail, DOB, lastName, firstName } = req.body;

  const user = await userModel.findById(req.user.id);
  if (firstName) {
    user.firstName = firstName;
  }

  if (lastName) {
    user.lastName = lastName;
  }

  if (recoveryEmail) {
    user.recoveryEmail = recoveryEmail;
  }
  if (mobile) {
    const exist = await userModel.findOne({ mobile });
    if (exist) {
      return next(new AppError("Mobile Already Exist!!", 400));
    }
    user.mobile = mobile;
  }

  if (email) {
    const exist = await userModel.findOne({ email });
    if (exist) {
      return next(new AppError("email Already Exist!!", 400));
    }
    user.email = email;
  }

  if (DOB) {
    let dateOfBirth = DOB.split("/");

    user.DOB = new Date(+dateOfBirth[2], +dateOfBirth[1], +dateOfBirth[0]);
  }

  await user.save();
  return res.status(200).json({ message: "Update user successfully" });
});

//***********************************deleteAccount***************************************

export const deleteAccount = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;

  if (!userId) {
    return next(new AppError("User not logged in", 401));
  }

  const user = await userModel.findById(userId);

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  await userModel.findByIdAndDelete(userId);

  return res.status(200).json({ message: "Account deleted successfully" });
});

//***********************************getUserAccountData***************************************

export const getUserAccountData = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;

  if (!userId) {
    return next(new AppError("User not logged in", 401));
  }

  const user = await userModel.findById(userId);

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  return res.status(200).json({ user });
});

//***********************************getProfileData***************************************

export const getProfileData = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(new AppError("User ID not provided", 400));
  }

  const user = await userModel.findById(id);

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  return res.status(200).json({ userProfile: user });
});

//***********************************updatePassword***************************************

export const updatePassword = asyncHandler(async (req, res, next) => {
  const { oldPassword, newPassword, rePasswords } = req.body;
  const user = await userModel.findById(req.user.id);
  if (!user) {
    return next(new AppError("User not found", 404));
  }

  const match = bcrypt.compareSync(oldPassword, user.password);
  if (!match) {
    return next(new AppError("Password is incorrect", 400));
  }

  const hashPassword = bcrypt.hashSync(newPassword, +process.env.SALT_ROUND);

  user.password = hashPassword;
  await user.save();
  return res.status(200).json({ message: "Update Password Success" });
});

//***********************************forgetPassword***************************************

export const forgetPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  const user = await userModel.findOne({ email });

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  const otp = nanoid(6);
  const hashOtp = bcrypt.hashSync(otp, +process.env.SALT_ROUND);
  user.passwordResetOTP = hashOtp;
  user.passwordResetExpiry = Date.now() + 10 * 60 * 1000;
  await user.save();

  return res.status(200).json({ message: "OTP sent successfully", otp });
});

//***********************************getAccountsByRecoveryEmail***************************************

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
