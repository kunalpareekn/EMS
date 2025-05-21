import express from "express";
import { clockIn, clockOut, getStats, getLogs } from "../../controllers/attendance/attendanceController.js";
import isAuthenticated from "../../middlewares/isAuthenticated.js";




const router = express.Router();

router.route("/clock-in").post(isAuthenticated, clockIn);
router.route("/clock-out/:id").patch(isAuthenticated, clockOut);
router.route("/stats").get(isAuthenticated, getStats);
router.route("/logs").get(isAuthenticated, getLogs);

export default router;
