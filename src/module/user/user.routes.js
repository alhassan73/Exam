import { Router } from "express";
import * as userController from "./user.controller.js";
import * as userValidation from "./user.validation.js";
import validate from "../../middleware/validtion.js";
import auth from "../../middleware/auth.js";
import multerlocal from "../../utils/multerLocal.js";
import validExtensions from "../../utils/validExtention.js";
import multerCloudnairy from "../../utils/multerCloudnairy.js";
const router = Router();

router.post("/signUp", validate(userValidation.signUp), userController.signUp);
router.post("/signIn", validate(userValidation.signIn), userController.signIn);
router.put(
  "/updateUser",
  validate(userValidation.update),
  auth(),
  userController.updateUser
);
router.delete("/deleteAccount", auth(), userController.deleteAccount);
router.get("/getUserAccountData", auth(), userController.getUserAccountData);
router.get("/getProfileData/:id", userController.getProfileData);
router.patch(
  "/updatePassword",
  auth(),
  validate(userValidation.updatePassword),
  userController.updatePassword
);
router.get("/forgetPassword", userController.forgetPassword);
router.get(
  "/getAccountsByRecoveryEmail",
  userController.getAccountsByRecoveryEmail
);

export default router;
