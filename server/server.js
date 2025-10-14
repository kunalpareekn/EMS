import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./db/database.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { apiLimiter } from "./middlewares/rateLimiter.js";

// Routers
import adminRouter from "./routes/Auth/AdminRoutes.js";
import employeeRouter from "./routes/Auth/EmployeeRoutes.js";
import leaveEmployeeRouter from "./routes/Employee/LeaveEmployeeRoutes.js";
import leaveAdminRouter from "./routes/Admin/LeaveAdminRoutes.js";
import projectRouter from "./routes/Admin/ProjectsRoutes.js";
import attendanceRouter from "./routes/Both/AttendaceRoutes.js";
import payrollRouter from "./routes/Admin/PayrollRoutes.js";
import profileDetailsRouter from "./routes/Employee/ProfileDetailsRoutes.js";
import notificationRouter from "./routes/Admin/NotificationRoutes.js";
import uploadRouter from "./routes/Both/UploadRoutes.js";
import forgotPasswordRouter from "./routes/Both/ForgotPasswordRoutes.js";
import taskRouter from "./routes/Both/TaskRoutes.js";

const app = express();
dotenv.config();

// Connect to MongoDB
connectDB();

// Middlewares
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(apiLimiter);

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

// -------- ADMIN ROUTES-------------
app.use("/api/v1/admin/auth", adminRouter);
app.use("/api/v1/admin/leave", leaveAdminRouter);
app.use("/api/v1/admin/project", projectRouter);
app.use("/api/v1/admin/payroll", payrollRouter);

// -------- EMPLOYEE ROUTES-------------
app.use("/api/v1/employee/auth", employeeRouter);
app.use("/api/v1/employee/leave", leaveEmployeeRouter);

// -------- BOTH ROUTES ---------------
app.use("/api/v1/both/attendance", attendanceRouter);
app.use("/api/v1/both/notification", notificationRouter);
app.use("/api/v1/both/profile-details", profileDetailsRouter);
app.use("/api/v1/both/document", uploadRouter);
app.use("/api/v1/both/password", forgotPasswordRouter);
app.use("/api/v1/both/project-task", taskRouter);

// ---------- Serve frontend (Vite build) ----------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendPath = path.join(__dirname, "../vite_client/dist");

app.use(express.static(frontendPath));

// If no API route matches, send the React app
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// Error handler
app.use(errorHandler);

// ✅ Export app (do NOT use app.listen() for Vercel)
export default app;
