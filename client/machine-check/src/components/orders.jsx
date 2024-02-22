import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders, updateOrder } from '../redux/slices/orders';
import { Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Select, MenuItem, InputLabel } from '@mui/material';

const OrdersPage = () => {
    const dispatch = useDispatch();
    const orders = useSelector(state => state.orders.orders);
    const loading = useSelector(state => state.orders.status) === 'loading';

    const [filteredOrders, setFilteredOrders] = useState([]);
    const [searchPhone, setSearchPhone] = useState('');

    useEffect(() => {
        dispatch(fetchOrders());
    }, [dispatch]);

    useEffect(() => {
        let filtered = [...orders];

        if (searchPhone) {
            filtered = filtered.filter(order =>
                order.user && order.user.phoneNumber.includes(searchPhone)
            );
        }

        setFilteredOrders(filtered);
    }, [orders, searchPhone]);

    const handleStatusChange = (orderId, newStatus) => {
        dispatch(updateOrder({ id: orderId, updatedData: { status: newStatus } }));
    };

    useEffect(() => {
        dispatch(fetchOrders());
    }, [dispatch]);

    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Заказы
            </Typography>
            <InputLabel>Поиск по номеру телефона</InputLabel>
            <TextField
                value={searchPhone}
                onChange={(e) => setSearchPhone(e.target.value)}
                margin="normal"
            />
            <TableContainer component={Paper} style={{ overflowX: 'auto' }}>
                <Table aria-label="orders table">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID заказа</TableCell>
                            <TableCell align="right">Пользователь</TableCell>
                            <TableCell align="right">Контакты</TableCell>
                            <TableCell align="right">Описание</TableCell>
                            <TableCell align="right">Статус</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredOrders.map((order) => (
                            <TableRow key={order._id}>
                                <TableCell component="th" scope="row">
                                    {order._id}
                                </TableCell>
                                <TableCell align="right">{order.user ? order.user.userName : 'Неизвестный'}</TableCell>
                                <TableCell align="right">{order.user ? order.user.phoneNumber : 'Неизвестный'}</TableCell>
                                <TableCell align="right">{order.description}</TableCell>
                                <TableCell align="right">
                                    <Select
                                        value={order.status}
                                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                    >
                                        <MenuItem value="pending">Pending</MenuItem>
                                        <MenuItem value="inProgress">In Progress</MenuItem>
                                        <MenuItem value="completed">Completed</MenuItem>
                                        <MenuItem value="declined">Declined</MenuItem>
                                    </Select>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default OrdersPage;
