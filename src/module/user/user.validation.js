import joi from "joi";

export const signUp = {
  body: joi
    .object()
    .required()
    .keys({
      name: joi.string().required().min(2).max(15),
      email: joi.string().required().email(),
      gender: joi.string().valid("male", "female").required(),
      password: joi.string().required(),
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
    // rePassword: joi.string().required().valid({ ref: "newPassword" }),
  }),
};
