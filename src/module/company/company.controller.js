import companyModel from "../../../db/model/company.model.js";
import userModel from "../../../db/model/user.model.js";
import AppError, { asyncHandler } from "../../utils/appErrors.js";

/* -------------------------------------------------------------------------- */
/*                                 addCompany                                 */
/* -------------------------------------------------------------------------- */
export const addCompany = asyncHandler(async (req, res, next) => {
  let {
    companyName,
    description,
    industry,
    numberOfEmployees,
    companyEmail,
    companyHR,
  } = req.body;
  const exists = await companyModel.findOne({ companyEmail });
  if (exists) {
    return next(new AppError("Company Already Exists", 409));
  }
  const company = await companyModel.create({
    companyName,
    description,
    industry,
    numberOfEmployees,
    companyEmail,
    companyHR: req.user._id,
  });
  company
    ? res.status(200).json({ message: "done", company })
    : next(new AppError("adding company Failed", 500));
});
/* -------------------------------------------------------------------------- */
/*                                updateCompany                               */
/* -------------------------------------------------------------------------- */
export const updateCompany = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { description, industry, companyEmail, companyHR, address } = req.body;
  const company = await companyModel.findOne({
    _id: id,
    companyHR: req.user._id,
  });
  if (!company) {
    return next(new AppError("Company not found", 404));
  }
  if (description) {
    company.description = description;
  }
  if (industry) {
    company.industry = industry;
  }
  if (address) {
    company.address = address;
  }
  if (companyEmail) {
    const exist = await companyModel.findOne({ companyEmail });
    if (exist) {
      return exist.companyEmail === company.companyEmail
        ? next(new AppError("Company Email is your current", 400))
        : next(
            new AppError(
              "Company Email is already in use by another Company",
              400
            )
          );
    }
    company.companyEmail = companyEmail;
  }
  if (companyHR) {
    const exist = await userModel.findOne({ companyHR });
    if (!exist) {
      return next(new AppError("User Not Found", 404));
    }
    company.companyHR = companyHR;
  }
  await company.save();
  return res.status(200).json({ msg: "done", company });
});
/* -------------------------------------------------------------------------- */
/*                                deleteCompany                               */
/* -------------------------------------------------------------------------- */
export const deleteCompany = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const company = await companyModel.findOneAndDelete({
    _id: id,
    companyHR: req.user._id,
  });
  if (!company) {
    return next(new AppError("Company not found", 404));
  }
  return res.status(200).json({ msg: "deleted" });
});
/* -------------------------------------------------------------------------- */
/*                                 getCompany                                 */
/* -------------------------------------------------------------------------- */
export const getCompany = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const company = await companyModel.findOne({
    _id: id,
    companyHR: req.user._id,
  });
  if (!company) {
    return next(new AppError("Company not found", 404));
  }
  return res.status(200).json({ msg: "done", company });
});
/* -------------------------------------------------------------------------- */
/*                               searchCompanies                              */
/* -------------------------------------------------------------------------- */
export const searchCompanies = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  if (!name) {
    return next(new AppError("Company name is required", 400));
  }
  const company = await companyModel.findOne({ companyName: name });
  if (!company) {
    return next(new AppError("Company not found", 404));
  }
  return res.status(200).json({ msg: "done", company });
});

//waiting for jobs collection to add the last endpoint
