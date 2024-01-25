import applicationModel from "../../../db/model/application.model.js";
import companyModel from "../../../db/model/company.model.js";
import jobModel from "../../../db/model/job.model.js";
import AppError, { asyncHandler } from "../../utils/appErrors.js";
import path from "path";
import fs from "fs";
import json2xls from "json2xls";
import cloudinary from "../../utils/cloudnairy.js";
import { nanoid } from "nanoid";
/* -------------------------------------------------------------------------- */
/*                       add Job  according to authority                      */
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
    // seniorityLevel,
    // jobTitle,
    // technicalSkills,
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
/* -------------------------------------------------------------------------- */
/*             This API will add a new document in the application            */
/* -------------------------------------------------------------------------- */
export const applyJob = asyncHandler(async (req, res, next) => {
  const { jobId } = req.params;
  const { userTechSkills, userSoftSkills } = req.body;
  const job = await jobModel.findById(jobId);
  if (!job) {
    return next(new AppError("job not found", 404));
  }
  const exists = await applicationModel.findOne({
    jobId,
    userId: req.user._id,
  });
  if (exists) {
    return next(new AppError("You Applied already to this job", 404));
  }
  if (!req.file) {
    return next(new AppError("Resume is required", 400));
  }
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: "resumes",
    }
  );
  const application = await applicationModel.create({
    jobId,
    userId: req.user._id,
    userSoftSkills,
    userTechSkills,
    userResume: secure_url,
  });
  if (!application) {
    await cloudinary.uploader.destroy(public_id);
    return next(new AppError("failed to add your application", 400));
  }
  return res.status(200).json({ message: "done", application });
});
/* -------------------------------------------------------------------------- */
/*                         getCompanyApplicationsExcel                        */
/* -------------------------------------------------------------------------- */
export const getCompanyApplicationsExcel = asyncHandler(
  async (req, res, next) => {
    const { companyId } = req.params;
    const { date } = req.body;
    const searchDate = new Date(date);
    const jobs = await jobModel.find({ addedBy: companyId });
    const jobIds = jobs.map((job) => job._id);
    const applications = await applicationModel.find({
      jobId: { $in: jobIds },
      createdAt: {
        $gte: searchDate,
        $lt: new Date(searchDate.getTime() + 24 * 60 * 60 * 1000),
      },
    });
    if (!applications || applications.length === 0) {
      return next(new AppError("No applications found", 404));
    }
    // Convert applications data to Excel
    const xls = json2xls(applications);
    const destpath = path.resolve(`uploads/`);
    if (!fs.existsSync(destpath)) {
      fs.mkdirSync(destpath, { recursive: true });
    }
    // Define the file path where you want to save the Excel file locally
    const filePath = path.join(destpath, `Application${nanoid(6)}.xlsx`);
    fs.writeFileSync(filePath, xls, "binary");
    res.json({ message: "Excel file saved locally", filePath });
  }
);
