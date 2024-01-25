import { Router } from "express";
import * as JC from "./jobs.controller.js";
import * as JV from "./jobs.validation.js";
import validate from "../../middleware/validtion.js";
import auth, { validRoles } from "../../middleware/auth.js";
import multerCloudnairy from "../../utils/multerCloudnairy.js";
import validExtensions from "../../utils/validExtention.js";
const router = Router();

router.post(
  "/addJob/:companyId",
  validate(JV.addJob),
  auth(validRoles.HR),
  JC.addJob
);
router.patch(
  "/updateJob/:companyId/:jobId",
  validate(JV.updateJob),
  auth(validRoles.HR),
  JC.updateJob
);
router.delete(
  "/deleteJob/:companyId/:jobId",
  validate(JV.deleteJob),
  auth(validRoles.HR),
  JC.deleteJob
);
router.get(
  "/getAllJobsWithCompanyInfo",
  auth([...validRoles.HR, ...validRoles.User]),
  JC.getAllJobsWithCompanyInfo
);
router.get(
  "/getAllJobsForCompany",
  auth([...validRoles.HR, ...validRoles.User]),
  JC.getAllJobsForCompany
);
router.get(
  "/filteredJobs",
  auth([...validRoles.HR, ...validRoles.User]),
  JC.filteredJobs
);
router.post(
  "/applyJob/:jobId",
  auth(validRoles.User),
  validate(JV.applyJob),
  multerCloudnairy(validExtensions.pdf).single("userResume"),
  JC.applyJob
);
router.get(
  "/getCompanyApplicationsExcel/:companyId",
  auth([...validRoles.HR, ...validRoles.User]),
  JC.getCompanyApplicationsExcel
);

export default router;
