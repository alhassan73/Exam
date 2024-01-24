import joi from "joi";
import { Types } from "mongoose";

const objectValidator = (value, helper) => {
  return Types.ObjectId.isValid(value) ? true : helper.error("any.invalid");
};
export const generalField = {
  email: joi.string().email().required(),
  password: joi.string().required(),
  file: joi.object().keys({
    size: joi.number().positive().required(),
    path: joi.string().required(),
    filename: joi.string().required(),
    mimetype: joi.string().required(),
    originalname: joi.string().required(),
    mimetype: joi.string().required(),
    destination: joi.string().required(),
    fieldname: joi.string().required(),
  }),
  id: joi.string().custom(objectValidator),
};
