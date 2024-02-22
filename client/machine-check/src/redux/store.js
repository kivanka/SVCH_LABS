import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from './slices/auth';
import { employeesReducer } from './slices/employees';
import { ordersReducer } from './slices/orders';
import { machinesReducer } from './slices/machines';

const store = configureStore({
    reducer: {
        auth: authReducer,
        employees: employeesReducer,
        orders: ordersReducer,
        machines: machinesReducer,
    }
});

export default store;