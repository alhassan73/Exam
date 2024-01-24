import joi from "joi";

export const signUp = {
  body: joi
    .object()
    .required()
    .keys({
      firstName: joi.string().required().min(2).max(15),
      lastName: joi.string().required().min(2).max(15),
      email: joi.string().required().email(),
      password: joi.string().required(),
      mobile: joi.string().regex(/^(\+201|01|00201)[0-2,5]{1}[0-9]{8}/),
    }),
};
export const signIn = {
  body: joi
    .object()
    .required()
    .keys({
      email: joi.string().required().email(),
      password: joi.string().required(),
      mobile: joi.string().regex(/^(\+201|01|00201)[0-2,5]{1}[0-9]{8}/),
    }),
};

export const updateUser = {
  body: joi.object().keys({
    name: joi.string().min(2).max(15),
    email: joi.string().email(),
    gender: joi.string().valid("male", "female"),
  }),
};

export const updatePassword = {
  body: joi.object().keys({
    oldPassword: joi.string().required(),
    newPassword: joi.string().required(),
    rePassword: joi.string().required().valid({ ref: "newPassword" }),
  }),
};
