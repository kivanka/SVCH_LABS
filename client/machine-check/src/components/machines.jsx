import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMachines } from '../redux/slices/machines';
import { Grid, Card, CardContent, Typography, CardMedia, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

const MachinePage = () => {
    const dispatch = useDispatch();
    const machines = useSelector(state => state.machines.machines);
    const loading = useSelector(state => state.machines.status) === 'loading';
    const [selectedMachine, setSelectedMachine] = useState(null); // Для хранения выбранного оборудования
    const [openDialog, setOpenDialog] = useState(false); // Управление открытием/закрытием диалога

    useEffect(() => {
        dispatch(fetchMachines());
    }, [dispatch]);

    const handleClickOpen = (machine) => {
        setSelectedMachine(machine);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <div>
            <Typography variant="h4" gutterBottom>Оборудование</Typography>
            <Grid container spacing={3}>
                {machines.map(machine => (
                    <Grid item key={machine._id} xs={12} sm={6} md={4}>
                        <Card
                            sx={{ '&:hover': { boxShadow: 6 } }}
                            onClick={() => handleClickOpen(machine)} // Добавляем обработчик клика
                        >
                            <CardMedia
                                component="img"
                                height="340"
                                image={machine.imageUrl || 'default_machine_image.jpg'}
                                alt={machine.name}
                            />
                            <CardContent>
                                <Typography variant="h5">{machine.name}</Typography>
                                <Typography variant="body2">{machine.condition}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Диалоговое окно для отображения дат обслуживания */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Даты обслуживания оборудования</DialogTitle>
                <DialogContent>
                    {selectedMachine && selectedMachine.serviceDates.map((date, index) => (
                        <Typography key={index}>{date}</Typography> // Предполагаем, что даты уже в нужном формате
                    ))}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Закрыть</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default MachinePage;
