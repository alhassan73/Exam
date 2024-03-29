import { Router } from "express";
import * as UC from "./user.controller.js";
import * as UV from "./user.validation.js";
import validate from "../../middleware/validtion.js";
import auth from "../../middleware/auth.js";
const router = Router();

router.post("/signUp", validate(UV.signUp), UC.signUp);
router.post("/signIn", validate(UV.signIn), UC.signIn);
router.patch("/updateUser", validate(UV.updateUser), auth(), UC.updateUser);
router.delete("/deleteUser", auth(), UC.deleteUser);
router.get("/getUser", auth(), UC.getUser);
router.get("/getAnyUserById/:id", UC.getAnyUserById);
router.patch(
  "/updatePassword",
  validate(UV.updatePassword),
  auth(),
  UC.updatePassword
);
router.patch("/forgetPassword", validate(UV.forgetPassword), UC.forgetPassword);
router.patch("/resetPassword", validate(UV.resetPassword), UC.resetPassword);
router.get("/getAccountsByRecoveryEmail", UC.getAccountsByRecoveryEmail);
export default router;
