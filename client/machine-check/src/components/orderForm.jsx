import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createOrder } from '../redux/slices/orders';
import { Box, TextField, Button, Select, MenuItem, InputLabel, FormControl } from '@mui/material';

const OrderForm = () => {
    const dispatch = useDispatch();
    const machines = useSelector(state => state.machines.machines); // Доступ к списку оборудования
    const [orderData, setOrderData] = useState({
        description: '',
        status: 'pending',
        product: '', // Добавлено для хранения выбранного оборудования
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        await dispatch(createOrder(orderData));
        setOrderData({ description: '', status: 'pending', product: '' });
    };

    const handleChange = (e) => {
        setOrderData({ ...orderData, [e.target.name]: e.target.value });
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <TextField
                required
                fullWidth
                multiline
                rows={4}
                id="description"
                label="Описание проблемы"
                name="description"
                value={orderData.description}
                onChange={handleChange}
                margin="normal"
            />
            <FormControl fullWidth margin="normal">
                <InputLabel id="product-label">Оборудование</InputLabel>
                <Select
                    labelId="product-label"
                    id="product"
                    name="product"
                    value={orderData.product}
                    label="Оборудование"
                    onChange={handleChange}
                >
                    {machines.map((machine) => (
                        <MenuItem key={machine._id} value={machine._id}>
                            {machine.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                Создать заказ
            </Button>
        </Box>
    );
};

export default OrderForm;
