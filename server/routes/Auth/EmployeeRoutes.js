import express from "express";
import { loginEmployee, registerEmployee } from "../../controllers/auth/employeeAuthController.js";

const router = express.Router();

router.route("/register").post(registerEmployee);
router.route("/login").post(loginEmployee);
  

export default router;