import { Schema, model } from "mongoose";

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 15,
  },
  lastName: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 15,
  },
  userName: {
    type: String,
    default: function () {
      return this.firstName + " " + this.lastName;
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
  },
  recoveryEmail: String,
  DOB: Date,
  mobile: {
    type: Number,
    unique: true,
    // sparse: true,
  },
  role: {
    type: String,
    enum: ["User", "Company_HR"],
    default: "User",
  },
  status: {
    type: String,
    enum: ["Online", "Offline"],
    default: "Offline",
  },
  passwordResetOTP: String,
  passwordResetExpiry: Date,
});

const userModel = model("user", userSchema);

export default userModel;
