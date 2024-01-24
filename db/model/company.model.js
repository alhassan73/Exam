import { Schema, model } from "mongoose";

const companySchema = new Schema({
  companyName: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  industry: {
    type: String,
    required: true,
  },
  address: String,
  numberOfEmployees: {
    min: {
      type: Number,
      required: true,
    },
    max: {
      type: Number,
      required: true,
    },
  },
  companyEmail: {
    type: String,
    required: true,
    unique: true,
  },
  companyHR: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
});

const companyModel = model("company", companySchema);

export default companyModel;
