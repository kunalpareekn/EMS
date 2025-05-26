import express from "express";
import { getAllEmployees, loginEmployee, logoutEmployee, registerEmployee } from "../../controllers/auth/employeeAuthController.js";
import isAdminAuthenticated from './../../middlewares/isAdminAuthenticated.js';
const router = express.Router();

router.route("/register").post(registerEmployee);
router.route("/login").post(loginEmployee);
router.route("/logout").get(logoutEmployee);
router.route("/get-all-employees").get(isAdminAuthenticated,getAllEmployees);
  

export default router;