import companyModel from "../../../db/model/company.model.js";
import jobModel from "../../../db/model/job.model.js";
import AppError, { asyncHandler } from "../../utils/appErrors.js";
/* -------------------------------------------------------------------------- */
/*                                   addJob                                   */
/* -------------------------------------------------------------------------- */
export const addJob = asyncHandler(async (req, res, next) => {
  const { companyId } = req.params;
  const {
    jobTitle,
    jobLocation,
    workingTime,
    seniorityLevel,
    jobDescription,
    technicalSkills,
    softSkills,
    addedBy,
  } = req.body;
  const company = await companyModel.findOne({
    _id: companyId,
    companyHR: req.user._id,
  });
  if (!company) {
    return next(new AppError("Company not found", 404));
  }
  const job = await jobModel.create({
    jobTitle,
    jobLocation,
    workingTime,
    seniorityLevel,
    jobDescription,
    technicalSkills,
    softSkills,
    addedBy: company._id,
  });
  job
    ? res.status(200).json({ message: "done", job })
    : next(new AppError("creating job Failed", 400));
});
/* -------------------------------------------------------------------------- */
/*                                  updateJob                                 */
/* -------------------------------------------------------------------------- */
export const updateJob = asyncHandler(async (req, res, next) => {
  const { companyId, jobId } = req.params;
  const { seniorityLevel, jobDescription, technicalSkills, softSkills } =
    req.body;
  //find if company exist or not to update its job
  const company = await companyModel.findOne({
    _id: companyId,
    companyHR: req.user._id,
  });
  if (!company) {
    return next(new AppError("Company not found", 404));
  }
  //find the job by its company and jobid
  const job = await jobModel.findOneAndUpdate(
    { _id: jobId, addedBy: company._id },
    {
      seniorityLevel,
      jobDescription,
      technicalSkills,
      softSkills,
    },
    { new: true }
  );
  return job
    ? res.status(200).json({ message: "Job updated", job })
    : next(new AppError("Job not found ", 404));
});
/* -------------------------------------------------------------------------- */
/*                                  deleteJob                                 */
/* -------------------------------------------------------------------------- */
export const deleteJob = asyncHandler(async (req, res, next) => {
  const { companyId, jobId } = req.params;
  //find if company exist or not to update its job
  const company = await companyModel.findOne({
    _id: companyId,
    companyHR: req.user._id,
  });
  if (!company) {
    return next(new AppError("Company not found", 404));
  }
  //find the job by its company and jobid to delete it
  const job = await jobModel.findByIdAndDelete(jobId);
  return job
    ? res.status(200).json({ message: "Job successfully deleted" })
    : next(new AppError("Job not Found", 404));
});
/* -------------------------------------------------------------------------- */
/*                       get All Jobs With Company Info                       */
/* -------------------------------------------------------------------------- */
export const getAllJobsWithCompanyInfo = asyncHandler(
  async (req, res, next) => {
    const jobs = await jobModel.find().populate("addedBy");
    return jobs.length
      ? res.status(200).json({
          message: "done",
          result: { numberOfJobs: jobs.length, jobs },
        })
      : next(new AppError("No Jobs Found", 404));
  }
);
/* -------------------------------------------------------------------------- */
/*                            getAllJobsForCompany                            */
/* -------------------------------------------------------------------------- */
export const getAllJobsForCompany = asyncHandler(async (req, res, next) => {
  const { name } = req.query;
  const company = await companyModel.findOne({ companyName: name });
  if (!company) {
    return next(new AppError("Company not Found", 404));
  }
  const jobs = await jobModel.find({ addedBy: company._id });
  return jobs.length
    ? res.status(200).json({
        message: "done",
        result: {
          nameOfCompany: company.companyName,
          numberOfJobs: jobs.length,
          jobs,
        },
      })
    : next(new AppError("No Jobs Found for this company", 404));
});
/* -------------------------------------------------------------------------- */
/*                Get all Jobs that match the following filters               */
/* -------------------------------------------------------------------------- */
export const filteredJobs = asyncHandler(async (req, res, next) => {
  const {
    workingTime,
    jobLocation,
    seniorityLevel,
    jobTitle,
    technicalSkills,
  } = req.body;
  const jobs = await jobModel.aggregate([
    {
      $match: {
        workingTime,
        jobLocation,
      }, //filter to match the body inputs
    },
  ]);
  return jobs.length
    ? res.status(200).json({
        message: "done",
        result: {
          numberOfJobs: jobs.length,
          jobs,
        },
      })
    : next(new AppError("No Jobs Found match this filters", 404));
});
