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
                            height="540"
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

    const rendermachines = () => (
        <Grid container spacing={2}>
            {machines.map(part => (
                <Grid item key={part._id} xs={12} sm={6} md={4}>
                    <Card>
                        <CardMedia
                            component="img"
                            height="540"
                            image={part.imageUrl || 'default_part_image.jpg'}
                            alt={part.name}
                        />
                        <CardContent>
                            <Typography variant="h5">{part.name}</Typography>
                            <Typography variant="body2">{part.model}</Typography>
                            <Typography variant="body2">{part.condition ? 'Available' : 'Not Available'}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Добро пожаловать в нашу прачечную!!!
            </Typography>
            <Typography variant="body1" style={{ marginBottom: '2rem' }}>
                СТИРАЕМ БУДЬ ЗДОРОВ!
            </Typography>

            <Typography variant="h4" gutterBottom style={{ marginTop: '2rem' }}>
                У НАС ЛУЧШИЕ СТИРАЛКИ!!!! В МИРЕ!!!!
            </Typography>
            {rendermachines()}
            <Typography>
                <Link to='/machines'>
                    подробнее
                </Link>
            </Typography>

            <Typography variant="h4" gutterBottom style={{ marginTop: '2rem' }}>
                Наши РАБОТНИКИ ГОДА МАКСИМ МАКСАКОВ!!!!
            </Typography>
            {renderEmployees()}
            <Typography>
                <Link to='/employees'>
                    подробнее
                </Link>
            </Typography>
        </div>
    );
};

export default HomePage;