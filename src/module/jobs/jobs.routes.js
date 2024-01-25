import { Router } from "express";
import * as JC from "./jobs.controller.js";
import * as JV from "./jobs.validation.js";
import validate from "../../middleware/validtion.js";
import auth, { validRoles } from "../../middleware/auth.js";
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

export default router;
