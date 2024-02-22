import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../axios';

export const createOrder = createAsyncThunk('orders/createOrder', async (orderData) => {
    const { data } = await axios.post('/orders/create', orderData);
    return data;
});

export const deleteOrder = createAsyncThunk('orders/deleteOrder', async (id) => {
    await axios.delete(`/orders/${id}/delete`);
    return id;
});

export const updateOrder = createAsyncThunk('orders/updateOrder', async ({ id, updatedData }) => {
    const { data } = await axios.patch(`/orders/${id}/update`, updatedData);
    return data;
});

export const fetchOrderById = createAsyncThunk('orders/fetchOrderById', async (id) => {
    const { data } = await axios.get(`/orders/${id}`);
    return data;
});

export const fetchOrders = createAsyncThunk('orders/fetchOrders', async () => {
    const { data } = await axios.get('/orders');
    return data;
});

const initialState = {
    orders: [],
    currentOrder: null,
    status: 'idle',
    error: null
};

const ordersSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createOrder.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.orders.push(action.payload);
                state.status = 'succeeded';
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })

            .addCase(deleteOrder.fulfilled, (state, action) => {
                state.orders = state.orders.filter(order => order._id !== action.payload);
                state.status = 'succeeded';
            })

            .addCase(updateOrder.fulfilled, (state, action) => {
                const index = state.orders.findIndex(order => order._id === action.payload._id);
                if (index !== -1) {
                    state.orders[index] = action.payload;
                }
                state.status = 'succeeded';
            })

            .addCase(fetchOrderById.pending, (state) => {
                state.currentOrder = null;
                state.status = 'loading';
            })
            .addCase(fetchOrderById.fulfilled, (state, action) => {
                state.currentOrder = action.payload;
                state.status = 'succeeded';
            })
            .addCase(fetchOrderById.rejected, (state, action) => {
                state.currentOrder = null;
                state.status = 'failed';
                state.error = action.error.message;
            })

            .addCase(fetchOrders.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.orders = action.payload;
                state.status = 'succeeded';
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    }
});

export const ordersReducer = ordersSlice.reducer;