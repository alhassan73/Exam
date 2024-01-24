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
    get: function () {
      return `${this.firstName} ${this.lastName}`;
    },
    set: function (userName) {
      const [firstName, ...lastName] = userName.split(" ");
      this.firstName = firstName;
      this.lastName = lastName.join(" ");
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
    type: String,
    match: /^(\+201|01|00201)[0-2,5]{1}[0-9]{8}/,
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
