import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { EMPLOYEE_AUTH_ENDPOINT } from '../utils/constant';

export const createEmployee = createAsyncThunk(
  'employees/createEmployee',
  async (employeeData, thunkAPI) => {
    try {
      const response = await axios.post(`${EMPLOYEE_AUTH_ENDPOINT}/register`, employeeData);
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.message || 'Failed to create employee');
    }
  }
);

const employeeSlice = createSlice({
  name: 'employees',
  initialState: {
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createEmployee.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createEmployee.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(createEmployee.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default employeeSlice.reducer;
