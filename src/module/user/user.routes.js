import { Router } from "express";
import * as UC from "./user.controller.js";
import * as UV from "./user.validation.js";
import validate from "../../middleware/validtion.js";
import auth from "../../middleware/auth.js";
import validExtensions from "../../utils/validExtention.js";
import multerCloudnairy from "../../utils/multerCloudnairy.js";
const router = Router();

router.post("/signUp", validate(UV.signUp), UC.signUp);
router.post("/signIn", validate(UV.signIn), UC.signIn);

export default router;
