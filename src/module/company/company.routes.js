import { Router } from "express";
import * as CC from "./company.controller.js";
import * as CV from "./company.validation.js";
import validate from "../../middleware/validtion.js";
import auth, { validRoles } from "../../middleware/auth.js";
const router = Router();
router.post(
  "/addCompany",
  validate(CV.addCompany),
  auth(validRoles.HR),
  CC.addCompany
);
router.patch(
  "/updateCompany/:id",
  validate(CV.updateCompany),
  auth(validRoles.HR),
  CC.updateCompany
);
router.delete("/deleteCompany/:id", auth(validRoles.HR), CC.deleteCompany);
router.get("/getCompany/:id", auth(validRoles.HR), CC.getCompany);
router.get(
  "/searchCompanies",
  auth([...validRoles.HR, ...validRoles.User]),
  CC.searchCompanies
);

export default router;
