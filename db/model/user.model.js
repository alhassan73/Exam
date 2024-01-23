import { Schema, model } from "mongoose";

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    default: function () {
      return this.firstName + this.lastName;
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
  },
  recoveryEmail: String,
  DOB: Date,
  mobile: {
    type: Number,
    unique: true,
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
});

const userModel = model("user", userSchema);

export default userModel;
