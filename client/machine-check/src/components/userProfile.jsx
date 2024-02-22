import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAuthMe } from '../redux/slices/auth';
import { fetchOrders } from '../redux/slices/orders';
import { Card, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const UserProfile = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.data);
    const orders = useSelector((state) => state.orders.orders);

    useEffect(() => {
        dispatch(fetchAuthMe());
        dispatch(fetchOrders());
    }, [dispatch]);

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <Card>
                <Typography variant='h5'>{user.userName}</Typography>
                <Typography variant='body1'>Телефон: {user.phoneNumber}</Typography>
            </Card>
            <Typography variant='h6' style={{ marginTop: '20px' }}>Ваши заказы:</Typography>
            <TableContainer component={Paper} style={{ marginTop: '20px' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Order ID</TableCell>
                              <TableCell align="right">Описание</TableCell>
                            <TableCell align="right">Статус</TableCell>
                        </TableRow>
                    </TableHead>                <TableBody>
                        {orders.map((order) => (
                            <React.Fragment key={order._id}>
                                <TableRow>
                                    <TableCell component="th" scope="row">
                                        {order._id}
                                    </TableCell>
                                    <TableCell align="right">{order.description}</TableCell>
                                    <TableCell align="right">{order.status}</TableCell>
                                </TableRow>
                            </React.Fragment>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default UserProfile;