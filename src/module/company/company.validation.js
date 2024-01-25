import joi from "joi";
import { generalField } from "../../utils/generalFields.js";

export const addCompany = {
  body: joi
    .object()
    .required()
    .keys({
      companyName: joi.string().required(),
      description: joi.string().required(),
      industry: joi.string().required(),
      address: joi.string(),
      numberOfEmployees: joi.object().keys({
        min: joi.number().required(),
        max: joi.number().required(),
      }),
      companyEmail: generalField.email,
      companyHR: generalField.id,
    }),
};
export const updateCompany = {
  body: joi.object().required().keys({
    description: joi.string().required(),
    industry: joi.string().required(),
    companyEmail: generalField.email,
    address: joi.string(),
  }),
  params: joi.object().keys({
    id: generalField.id.required(),
  }),
};
