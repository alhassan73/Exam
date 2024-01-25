import joi from "joi";
import { generalField } from "../../utils/generalFields.js";
export const addJob = {
  body: joi.object().keys({
    jobTitle: joi.string().required(),
    jobLocation: joi.string().valid("onsite", "remotely", "hyprid"),
    workingTime: joi.string().valid("part-time", "full-time"),
    seniorityLevel: joi
      .string()
      .valid("Junior", "Mid-Level", "Senior", "Team-Lead", "CTO"),
    jobDescription: joi.string(),
    technicalSkills: joi.array().items(joi.string()),
    softSkills: joi.array().items(joi.string()),
  }),
  params: joi.object().keys({
    companyId: generalField.id.required(),
  }),
};
export const updateJob = {
  body: joi.object().keys({
    seniorityLevel: joi
      .string()
      .valid("Junior", "Mid-Level", "Senior", "Team-Lead", "CTO"),
    jobDescription: joi.string(),
    technicalSkills: joi.array().items(joi.string()),
    softSkills: joi.array().items(joi.string()),
  }),
  params: joi.object().keys({
    companyId: generalField.id.required(),
    jobId: generalField.id.required(),
  }),
};
export const deleteJob = {
  params: joi.object().keys({
    companyId: generalField.id.required(),
    jobId: generalField.id.required(),
  }),
};
