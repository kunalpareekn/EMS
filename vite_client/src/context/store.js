import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Import your reducers
import authReducer from "./Auth/authSlice";
import projectReducer from "./projectSlice";
import employeeReducer from "./employeeSlice";
import payrollReducer from './payrollSlice';
import leaveReducer from "./leaveSlice";
import employeeLeaveReducer from "./employeeLeaveSlice";
import attendanceReducer from "./attendanceSlice";

// 1. Combine reducers FIRST
const rootReducer = combineReducers({
  auth: authReducer,
  project: projectReducer,
  employees: employeeReducer,
  payroll: payrollReducer,
  leave: leaveReducer,
  employeeLeave: employeeLeaveReducer,
  attendance: attendanceReducer,
});

// 2. THEN apply persistConfig
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'employees', 'leave'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer); // ✅ Now rootReducer is a function

// 3. Create store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
export default store;