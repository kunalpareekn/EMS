import express from "express";
import { loginEmployee, logoutEmployee, registerEmployee } from "../../controllers/auth/employeeAuthController.js";

const router = express.Router();

router.route("/register").post(registerEmployee);
router.route("/login").post(loginEmployee);
router.route("/logout").get(logoutEmployee);
  

export default router;