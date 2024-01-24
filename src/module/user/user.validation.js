import Joi from "joi";

export const signUp = {
  body: Joi.object()
    .required()
    .keys({
      firstName: Joi.string().required().min(2).max(15),
      lastName: Joi.string().required().min(2).max(15),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
      mobile: Joi.number().integer().positive(),
      DOB: Joi.date(),
    }),
};

export const signIn = {
  body: Joi.object()
    .required()
    .keys({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
      mobile: Joi.number().integer().positive(),
    }),
};

export const update = {
  body: Joi.object()
    .required()
    .keys({
      firstName: Joi.string().required().min(2).max(15),
      lastName: Joi.string().required().min(2).max(15),
      email: Joi.string().email().required(),
      recoveryEmail: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
      mobile: Joi.number().integer().positive(),
    }),
};

export const updatePassword = {
  body: Joi.object()
    .required()
    .keys({
      oldPassword: Joi.string().min(6).required(),
      newPassword: Joi.string().min(6).required(),
      rePassword: Joi.string().valid(Joi.ref("newPassword")).required(),
    }),
};
