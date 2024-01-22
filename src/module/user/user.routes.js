import { Router } from "express";
import * as userController from "./user.controller.js";
import * as userValidation from "./user.validation.js";
import validate from "../../middleware/validtion.js";
import auth from "../../middleware/auth.js";
import multerlocal from "../../utils/multerLocal.js";
import validExtensions from "../../utils/validExtention.js";
import multerCloudnairy from "../../utils/multerCloudnairy.js";
const router = Router();


export default router;
