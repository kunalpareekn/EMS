import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./db/database.js";
import {errorHandler} from "./middlewares/errorHandler.js";
import { apiLimiter } from "./middlewares/rateLimiter.js";
import adminRouter from "./routes/Auth/AdminRoutes.js";
import employeeRouter from "./routes/Auth/EmployeeRoutes.js";
import leaveEmployeeRouter from "./routes/Employee/LeaveEmployeeRoutes.js"
import leaveAdminRouter from "./routes/Admin/LeaveAdminRoutes.js"
import projectRouter from "./routes/Admin/ProjectsRoutes.js"
import attendanceRouter from "./routes/Employee/AttendaceRoutes.js"
import payrollRouter from "./routes/Admin/PayrollRoutes.js"



const app  = express();

dotenv.config();

const PORT = process.env.PORT || 5000

//mongoose connection
connectDB();

//middleware 
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(apiLimiter); // Apply rate limiting to all routes
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));








//routes -------- ADMIN ROUTES-------------
app.use("/api/v1/admin/auth",adminRouter);
app.use("/api/v1/admin/leave",leaveAdminRouter);
app.use("/api/v1/admin/project",projectRouter);
app.use("/api/v1/admin/payroll",payrollRouter);

//routes -------- EMPLOYEE ROUTES-------------
app.use("/api/v1/employee/auth",employeeRouter);
app.use("/api/v1/employee/leave",leaveEmployeeRouter);
app.use("/api/v1/employee/attendance",attendanceRouter);








//basic routes
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'API is running...',
        version: '1.0.0'
    });
});
// Handle 404 routes
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

//error handler
app.use(errorHandler);


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
}); 
