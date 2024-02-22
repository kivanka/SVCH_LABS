import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEmployees } from '../redux/slices/employees';
import { Grid, Card, CardContent, Typography, CardMedia } from '@mui/material';

const EmployeesPage = () => {
    const dispatch = useDispatch();
    const employees = useSelector(state => state.employees.employees);
    const loading = useSelector(state => state.employees.status) === 'loading';

    useEffect(() => {
        dispatch(fetchEmployees());
    }, [dispatch]);

    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Наши сотрудники
            </Typography>
            <Grid container spacing={3}>
                {employees.map(employee => (
                    <Grid item key={employee._id} xs={12} sm={6} md={4}>
                        <Card>
                            <CardMedia
                                component="img"
                                height="340"
                                image={employee.imageUrl || 'default_employee_image.jpg'}
                                alt={employee.name}
                            />
                            <CardContent>
                                <Typography variant="h5">{employee.name}</Typography>
                                <Typography variant="body1">{employee.position}</Typography>
                                <Typography variant="body2">{employee.specialization}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
};

export default EmployeesPage;