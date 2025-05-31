import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./Auth/authSlice";
import projectReducer from "./projectSlice";
import employeeReducer from "./employeeSlice"
import payrollReducer from './payrollSlice'
import leaveReducer from "./leaveSlice";
import employeeLeaveReducer from "./employeeLeaveSlice"
import attendanceReducer from "./attendanceSlice"





const store = configureStore({
    reducer: {
        auth:authReducer,
        project:projectReducer,
    employees:employeeReducer,
    payroll:payrollReducer,
    leave:leaveReducer,
    employeeLeave:employeeLeaveReducer,
    attendance:attendanceReducer
    }
        
});
export default store;