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

export default router;
