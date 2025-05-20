import express from "express";
import { getAllLeaves, getLeaveStatistics } from "../../controllers/leave/leaveAdminController.js";
 

const router = express.Router();
 
router.route("/get-all-leaves").get(getAllLeaves)
router.route("/get-leave-statistics").get(getLeaveStatistics)
//update stautus route incomplete
router.route("/update-leave-staus")




export default router;