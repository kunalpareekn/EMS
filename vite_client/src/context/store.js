import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./Auth/authSlice";
import projectReducer from "./projectSlice";
import employeeReducer from "./employeeSlice"
const store = configureStore({
    reducer: {
        auth:authReducer,
        project:projectReducer,
    employees:employeeReducer
    
    }
        
});
export default store;