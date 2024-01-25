import companyModel from "../../../db/model/company.model.js";
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
export const updateCompany = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { description, industry, companyEmail, companyHR } = req.body;
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
      if (exist.companyEmail === companyEmail) {
      }
    }
  }
});
