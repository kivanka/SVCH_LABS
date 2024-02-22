import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEmployees, createEmployee, deleteEmployee, updateEmployee } from '../redux/slices/employees';
import { Grid, Card, CardContent, Typography, CardMedia, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import axios from '../redux/axios';

const EmployeesAdminPage = () => {
    const dispatch = useDispatch();
    const employees = useSelector(state => state.employees.employees);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openCreateDialog, setOpenCreateDialog] = useState(false);
    const [currentEmployee, setCurrentEmployee] = useState(null);
    const [newEmployee, setNewEmployee] = useState({ name: '', position: '', specialization: '', imageUrl: '' });
    const [imageFile, setImageFile] = useState(null);

    useEffect(() => {
        dispatch(fetchEmployees());
    }, [dispatch]);

    const handleOpenEditDialog = (employee) => {
        setCurrentEmployee(employee);
        setOpenEditDialog(true);
    };

    const handleDelete = (id) => {
        dispatch(deleteEmployee(id));
    };

    const handleCloseEditDialog = () => {
        setOpenEditDialog(false);
        setCurrentEmployee(null);
    };

    const handleOpenCreateDialog = () => {
        setOpenCreateDialog(true);
    }; const handleCloseCreateDialog = () => {
        setOpenCreateDialog(false);
        setNewEmployee({ name: '', position: '', specialization: '', imageUrl: '' });
    };

    const handleChange = (e, isCurrentEmployee = true) => {
        const employee = isCurrentEmployee ? currentEmployee : newEmployee;
        const updatedEmployee = { ...employee, [e.target.name]: e.target.value };
        if (isCurrentEmployee) {
            setCurrentEmployee(updatedEmployee);
        } else {
            setNewEmployee(updatedEmployee);
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

    const handleCreateOrUpdateEmployee = async (isCreate) => {
        let employeeData = isCreate ? newEmployee : currentEmployee;

        if (imageFile) {
            const formData = new FormData();
            formData.append('image', imageFile);
            const uploadedImageData = await uploadImage(formData);
            if (uploadedImageData && uploadedImageData.url) {
                employeeData = { ...employeeData, imageUrl: `${window.location.protocol}//localhost:4444${uploadedImageData.url}` };
            }
        }

        if (isCreate) {
            dispatch(createEmployee(employeeData));
            handleCloseCreateDialog();
        } else {
            dispatch(updateEmployee({ id: currentEmployee._id, updatedData: employeeData }));
            handleCloseEditDialog();
        }
        setImageFile(null); // Reset the image file after handling
    };

    return (
        <div>
            <Typography variant="h4" gutterBottom>Управление сотрудниками</Typography>
            <Button color="primary" onClick={handleOpenCreateDialog}>Добавить сотрудника</Button>        <Grid container spacing={3}>
                {employees.map(employee => (
                    <Grid item key={employee._id} xs={12} sm={6} md={4}>
                        <Card>
                            <CardMedia
                                component="img"
                                height="240"
                                image={employee.imageUrl || 'default_employee_image.jpg'}
                                alt={employee.name}
                            />
                            <CardContent>
                                <Typography variant="h5">{employee.name}</Typography>
                                <Typography variant="body1">{employee.position}</Typography>
                                <Typography variant="body2">{employee.specialization}</Typography>
                                <Button color="primary" onClick={() => handleOpenEditDialog(employee)}>Изменить</Button>
                                <Button color="secondary" onClick={() => handleDelete(employee._id)}>Удалить</Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Dialog for Creating a New Employee */}
            <Dialog open={openCreateDialog} onClose={handleCloseCreateDialog}>
                <DialogTitle>Добавить нового сотрудника</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="name"
                        label="Имя"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={newEmployee.name}
                        onChange={(e) => handleChange(e, false)}
                    />
                    <TextField
                        margin="dense"
                        name="position"
                        label="Должность"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={newEmployee.position}
                        onChange={(e) => handleChange(e, false)}
                    />
                    <TextField
                        margin="dense"
                        name="specialization"
                        label="Специализация"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={newEmployee.specialization}
                        onChange={(e) => handleChange(e, false)}
                    />
                    <TextField
                        type="file"
                        margin="dense"
                        fullWidth
                        variant="standard"
                        onChange={handleFileChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseCreateDialog}>Отмена</Button>
                    <Button onClick={() => handleCreateOrUpdateEmployee(true)}>Создать</Button>
                </DialogActions>
            </Dialog>

            {/* Dialog for Editing an Employee */}
            <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
                <DialogTitle>Изменить сотрудника</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="name"
                        label="Имя"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={currentEmployee?.name}
                        onChange={(e) => handleChange(e, true)}
                    />
                    <TextField
                        margin="dense"
                        name="position"
                        label="Должность"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={currentEmployee?.position}
                        onChange={(e) => handleChange(e, true)}
                    />
                    <TextField
                        margin="dense"
                        name="specialization"
                        label="Специализация"
                        type
                        ="text"
                        fullWidth
                        variant="standard"
                        value={currentEmployee?.specialization}
                        onChange={(e) => handleChange(e, true)}
                    />
                    <TextField
                        type="file"
                        margin="dense"
                        fullWidth
                        variant="standard"
                        onChange={handleFileChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseEditDialog}>Отмена</Button>
                    <Button onClick={() => handleCreateOrUpdateEmployee(false)}>Сохранить</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default EmployeesAdminPage;