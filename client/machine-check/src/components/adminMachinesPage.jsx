import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMachines, createMachine, deleteMachine, updateMachine } from '../redux/slices/machines';
import { Grid, Card, CardContent, Typography, CardMedia, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Select, MenuItem } from '@mui/material';
import axios from '../redux/axios';

const AdminMachinePage = () => {
    const dispatch = useDispatch();
    const machines = useSelector(state => state.machines.machines);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openCreateDialog, setOpenCreateDialog] = useState(false);
    const [currentMachine, setCurrentMachine] = useState(null);
    const [newMachine, setNewMachine] = useState({ name: '', imageUrl: '', condition: '', serviceDates: [] });
    const [imageFile, setImageFile] = useState(null);

    useEffect(() => {
        dispatch(fetchMachines());
    }, [dispatch]);

    const handleOpenEditDialog = (machine) => {
        setCurrentMachine(machine);
        setOpenEditDialog(true);
    };

    const handleCloseEditDialog = () => {
        setOpenEditDialog(false);
        setCurrentMachine(null);
    };

    const handleOpenCreateDialog = () => {
        setOpenCreateDialog(true);
    };

    const handleCloseCreateDialog = () => {
        setOpenCreateDialog(false);
        setNewMachine({ name: '', imageUrl: '', condition: '', serviceDates: [] });
    };

    const handleChange = (e, type) => {
        const { name, value } = e.target;
        if (type === 'new') {
            setNewMachine({ ...newMachine, [name]: value });
        } else {
            setCurrentMachine({ ...currentMachine, [name]: value });
        }
    };

    const handleServiceDateChange = (e, index, type) => {
        const { value } = e.target;
        let dates = type === 'new' ? [...newMachine.serviceDates] : [...currentMachine.serviceDates];
        dates[index] = value;
        if (type === 'new') {
            setNewMachine({ ...newMachine, serviceDates: dates });
        } else {
            setCurrentMachine({ ...currentMachine, serviceDates: dates });
        }
    };

    const addServiceDate = (type) => {
        if (type === 'new') {
            setNewMachine({ ...newMachine, serviceDates: [...newMachine.serviceDates, ''] });
        } else {
            setCurrentMachine({ ...currentMachine, serviceDates: [...currentMachine.serviceDates, ''] });
        }
    };

    const handleFileChange = (event) => {
        setImageFile(event.target.files[0]);
    };

    const uploadImage = async (formData) => {
        try {
            const response = await axios.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error uploading file:', error);
            return null;
        }
    };

    const handleCreateOrUpdateMachine = async (isCreate) => {
        let machineData = isCreate ? newMachine : currentMachine;

        if (imageFile) {
            const formData = new FormData();
            formData.append('image', imageFile);
            const uploadedImageData = await uploadImage(formData);
            if (uploadedImageData && uploadedImageData.url) {
                machineData = { ...machineData, imageUrl: `${window.location.protocol}//localhost:4444${uploadedImageData.url}` };
            }
        }

        if (isCreate) {
            dispatch(createMachine(machineData));
            handleCloseCreateDialog();
        } else {
            dispatch(updateMachine({ id: currentMachine._id, updatedData: machineData }));
            handleCloseEditDialog();
        }
    };

    return (
        <div>
            <Typography variant="h4" gutterBottom>Управление Оборудованием</Typography>
            <Button color="primary" onClick={handleOpenCreateDialog}>Добавить Оборудование</Button>
            <Grid container spacing={3}>
                {machines.map(machine => (
                    <Grid item key={machine._id} xs={12} sm={6} md={4}>
                        <Card>
                            <CardMedia
                                component="img"
                                height="240"
                                image={machine.imageUrl || 'default_machine_image.jpg'}
                                alt={machine.name}
                            />
                            <CardContent>
                                <Typography variant="h5">{machine.name}</Typography>
                                <Typography variant="body2">{`Состояние: ${machine.condition}`}</Typography>
                                <Button color="primary" onClick={() => handleOpenEditDialog(machine)}>Изменить</Button>
                                <Button color="secondary" onClick={() => dispatch(deleteMachine(machine._id))}>Удалить</Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Dialog for Creating a New Machine */}
            <Dialog open={openCreateDialog} onClose={handleCloseCreateDialog}>
                <DialogTitle>Добавить Оборудование</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="name"
                        label="Название"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={newMachine.name}
                        onChange={(e) => handleChange(e, 'new')}
                    />
                    {/* Select for condition */}
                    <Select
                        label="Состояние"
                        name="condition"
                        value={newMachine.condition}
                        onChange={(e) => handleChange(e, 'new')}
                        fullWidth
                        displayEmpty
                        variant="standard"
                        inputProps={{ 'aria-label': 'Without label' }}
                    >
                        <MenuItem value="">
                            <em>Не определено</em>
                        </MenuItem>
                        <MenuItem value="в эксплуатации">В эксплуатации</MenuItem>
                        <MenuItem value="требует тех обслуживания">Требует тех обслуживания</MenuItem>
                        <MenuItem value="в ремонте">В ремонте</MenuItem>
                    </Select>
                    {/* Input for service dates */}
                    {newMachine.serviceDates.map((date, index) => (
                        <TextField
                            key={index}
                            margin="dense"
                            name="serviceDate"
                            label={`Дата обслуживания ${index + 1}`}
                            type="text"
                            fullWidth
                            variant="standard"
                            value={date}
                            onChange={(e) => handleServiceDateChange(e, index, 'new')}
                        />
                    ))}
                    <Button onClick={() => addServiceDate('new')}>Добавить дату обслуживания</Button>
                    <TextField
                        type="file"
                        margin="dense"
                        fullWidth
                        variant="standard"
                        onChange={handleFileChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseCreateDialog}>Cancel</Button>
                    <Button onClick={() => handleCreateOrUpdateMachine(true)}>Create</Button>
                </DialogActions>
            </Dialog>
            {/* Dialog for Editing a Machine */}
            <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
                <DialogTitle>Изменить Оборудование</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="name"
                        label="Название"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={currentMachine?.name}
                        onChange={(e) => handleChange(e, 'edit')}
                    />
                    {/* Select for condition */}
                    <Select
                        label="Состояние"
                        name="condition"
                        value={currentMachine?.condition}
                        onChange={(e) => handleChange(e, 'edit')}
                        fullWidth
                        displayEmpty
                        variant="standard"
                        inputProps={{ 'aria-label': 'Without label' }}
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        <MenuItem value="в эксплуатации">В эксплуатации</MenuItem>
                        <MenuItem value="требует тех обслуживания">Требует тех обслуживания</MenuItem>
                        <MenuItem value="в ремонте">В ремонте</MenuItem>
                    </Select>
                    {/* Input for service dates */}
                    {currentMachine?.serviceDates.map((date, index) => (
                        <TextField
                            key={index}
                            margin="dense"
                            name="serviceDate"
                            label={`Дата обслуживания ${index + 1}`}
                            type="text"
                            fullWidth
                            variant="standard"
                            value={date}
                            onChange={(e) => handleServiceDateChange(e, index, 'edit')}
                        />
                    ))}
                    <Button onClick={() => addServiceDate('edit')}>Добавить дату обслуживания</Button>
                    <TextField
                        type="file"
                        margin="dense"
                        fullWidth
                        variant="standard"
                        onChange={handleFileChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseEditDialog}>Cancel</Button>
                    <Button onClick={() => handleCreateOrUpdateMachine(false)}>Save</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default AdminMachinePage;
