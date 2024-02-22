import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../axios';

// Асинхронные действия
export const fetchEmployees = createAsyncThunk('employees/fetchEmployees', async () => {
    const { data } = await axios.get('/employees');
    return data;
});

export const fetchEmployeeById = createAsyncThunk('employees/fetchEmployeeById', async (id) => {
    const { data } = await axios.get(`/employees/${id}`);
    return data;
});

export const createEmployee = createAsyncThunk('employees/createEmployee', async (employeeData) => {
    const { data } = await axios.post('/employees/create', employeeData);
    return data;
});

export const updateEmployee = createAsyncThunk('employees/updateEmployee', async ({ id, updatedData }) => {
    const { data } = await axios.patch(`/employees/${id}/update`, updatedData);
    return data;
});

export const deleteEmployee = createAsyncThunk('employees/deleteEmployee', async (id) => {
    await axios.delete(`/employees/${id}/delete`);
    return id;
});

const initialState = {
    employees: [],
    currentEmployee: null,
    status: 'idle',
    error: null
};

const employeesSlice = createSlice({
    name: 'employees',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchEmployees.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchEmployees.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.employees = action.payload;
            })
            .addCase(fetchEmployees.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(fetchEmployeeById.pending, (state) => {
                state.currentEmployee = null;
                state.status = 'loading';
            })
            .addCase(fetchEmployeeById.fulfilled, (state, action) => {
                state.currentEmployee = action.payload;
                state.status = 'succeeded';
            })
            .addCase(fetchEmployeeById.rejected, (state, action) => {
                state.currentEmployee = null;
                state.status = 'failed';
                state.error = action.error.message;
            })
            
            .addCase(createEmployee.fulfilled, (state, action) => {
                state.employees.push(action.payload);
            })
            .addCase(updateEmployee.fulfilled, (state, action) => {
                const index = state.employees.findIndex(employee => employee._id === action.payload._id);
                if (index !== -1) {
                    state.employees[index] = action.payload;
                }
            })
            .addCase(deleteEmployee.fulfilled, (state, action) => {
                state.employees = state.employees.filter(employee => employee._id !== action.payload);
            });
    }
});

export const employeesReducer = employeesSlice.reducer;