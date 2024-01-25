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
