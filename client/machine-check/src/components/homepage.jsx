import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMachines } from '../redux/slices/machines';
import { fetchEmployees } from '../redux/slices/employees';
import { Grid, Card, CardContent, Typography, CardMedia } from '@mui/material';
import { Link } from 'react-router-dom';

const HomePage = () => {
    const dispatch = useDispatch();
    const employees = useSelector(state => state.employees.employees.slice(0, 4));
    const machines = useSelector(state => state.machines.machines.slice(0, 4));

    useEffect(() => {
        dispatch(fetchEmployees());
        dispatch(fetchMachines());
    }, [dispatch]);

    const renderEmployees = () => (
        <Grid container spacing={2}>
            {employees.map(employee => (
                <Grid item key={employee._id} xs={12} sm={6} md={4}>
                    <Card>
                        <CardMedia
                            component="img"
                            height="200"
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
    );

    const renderMachines = () => (
        <Grid container spacing={2}>
            {machines.map(machine => (
                <Grid item key={machine._id} xs={12} sm={6} md={4}>
                    <Card>
                        <CardMedia
                            component="img"
                            height="200"
                            image={machine.imageUrl || 'default_machine_image.jpg'}
                            alt={machine.name}
                        />
                        <CardContent>
                            <Typography variant="h5">{machine.name}</Typography>
                            <Typography variant="body2">Model: {machine.model}</Typography>
                            <Typography variant="body2">Status: {machine.condition ? 'Operational' : 'Under Maintenance'}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Welcome to Our Machine Control Service!
            </Typography>
            <Typography variant="body1" style={{ marginBottom: '2rem' }}>
                Ensuring Efficiency and Reliability in Your Production Line
            </Typography>

            <Typography variant="h4" gutterBottom style={{ marginTop: '2rem' }}>
                Our Top Machines
            </Typography>
            {renderMachines()}
            <Typography>
                <Link to='/machines'>
                    View More
                </Link>
            </Typography>

            <Typography variant="h4" gutterBottom style={{ marginTop: '2rem' }}>
                Meet Our Expert Technicians
            </Typography>
            {renderEmployees()}
            <Typography>
                <Link to='/employees'>
                    View More
                </Link>
            </Typography>
        </div>
    );
};

export default HomePage;
