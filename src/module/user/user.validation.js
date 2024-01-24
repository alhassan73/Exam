import joi from "joi";
import { generalField } from "../../utils/generalFields.js";

export const signUp = {
  body: joi
    .object()
    .required()
    .keys({
      firstName: joi.string().min(2).max(15).required(),
      lastName: joi.string().min(2).max(15).required(),
      email: joi.string().required().email(),
      password: joi.string().required(),
      dob: joi.date(),
      recoveryEmail: joi.string().email(),
      mobile: joi.string().regex(/^(\+201|01|00201)[0-2,5]{1}[0-9]{8}/),
    }),
};
export const signIn = {
  body: joi
    .object()
    .required()
    .xor("email", "mobile")
    .keys({
      email: joi.string().email(),
      mobile: joi.string().regex(/^(\+201|01|00201)[0-2,5]{1}[0-9]{8}/),
      password: joi.string().required(),
    }),
};

export const updateUser = {
  body: joi.object().keys({
    firstName: joi.string().min(2).max(15).required(),
    lastName: joi.string().min(2).max(15).required(),
    email: joi.string().email(),
    password: joi.string(),
    dob: joi.date(),
    recoveryEmail: joi.string().email(),
    mobile: joi.string().regex(/^(\+201|01|00201)[0-2,5]{1}[0-9]{8}/),
  }),
};
export const getAnyUserById = {
  params: joi.object().keys({
    id: generalField.id.required(),
  }),
};
export const updatePassword = {
  body: joi.object().keys({
    oldPassword: joi.string().required(),
    newPassword: joi.string().required(),
  }),
};
export const forgetPassword = {
  body: joi.object().keys({
    email: joi.string().email(),
  }),
};
export const resetPassword = {
  body: joi.object().keys({
    email: generalField.email,
    otp: joi.string().required(),
    newPassword: joi.string().required(),
  }),
};
