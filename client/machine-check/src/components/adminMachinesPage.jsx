import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { fetchEmployees, createEmployee, deleteEmployee, updateEmployee } from '../redux/slices/employees';
import { Grid, Card, CardContent, Typography, CardMedia, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import axios from '../redux/axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EmployeesAdminPage = () => {
    const dispatch = useDispatch();
    const employees = useSelector(state => state.employees.employees);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openCreateDialog, setOpenCreateDialog] = useState(false);
    const [currentEmployee, setCurrentEmployee] = useState(null);
    const [imageFile, setImageFile] = useState(null);

    const { control, handleSubmit, reset } = useForm();

    useEffect(() => {
        dispatch(fetchEmployees());
    }, [dispatch]);

    const handleOpenEditDialog = (employee) => {
        setCurrentEmployee(employee);
        setOpenEditDialog(true);
        reset(employee);
    };

    const handleDelete = (id) => {
        dispatch(deleteEmployee(id));
        toast.success('Employee deleted successfully!');
    };

    const handleCloseEditDialog = () => {
        setOpenEditDialog(false);
        setCurrentEmployee(null);
    };

    const handleOpenCreateDialog = () => {
        setOpenCreateDialog(true);
    };

    const handleCloseCreateDialog = () => {
        setOpenCreateDialog(false);
        reset();
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

    const handleCreateOrUpdateEmployee = async (data, isCreate) => {
        let employeeData = isCreate ? data : { ...currentEmployee, ...data };

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
            toast.success('Employee created successfully!');
        } else {
            dispatch(updateEmployee({ id: currentEmployee._id, updatedData: employeeData }));
            handleCloseEditDialog();
            toast.success('Employee updated successfully!');
        }
        setImageFile(null); // Reset the image file after handling
    };

    const generatePDFReport = () => {
        const doc = new jsPDF();
        doc.text('Employee Report', 20, 10);
        const tableColumn = ['Name', 'Position', 'Specialization'];
        const tableRows = [];

        employees.forEach(employee => {
            const employeeData = [
                employee.name,
                employee.position,
                employee.specialization,
            ];
            tableRows.push(employeeData);
        });

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 20,
        });
        doc.save('employee_report.pdf');
    };

    const generateExcelReport = () => {
        const worksheet = XLSX.utils.json_to_sheet(employees.map(employee => ({
            Name: employee.name,
            Position: employee.position,
            Specialization: employee.specialization,
        })));
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Employees');
        XLSX.writeFile(workbook, 'employee_report.xlsx');
    };

    return (
        <div>
            <Typography variant="h4" gutterBottom>Управление сотрудниками</Typography>
            <Button color="primary" onClick={handleOpenCreateDialog}>Добавить сотрудника</Button>
            <Button color="primary" onClick={generatePDFReport}>Generate PDF Report</Button>
            <Button color="primary" onClick={generateExcelReport}>Generate Excel Report</Button>
            <Grid container spacing={3}>
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
                    <form onSubmit={handleSubmit((data) => handleCreateOrUpdateEmployee(data, true))}>
                        <Controller
                            name="name"
                            control={control}
                            defaultValue=""
                            render={({ field }) => <TextField {...field} autoFocus margin="dense" label="Имя" type="text" fullWidth variant="standard" />}
                        />
                        <Controller
                            name="position"
                            control={control}
                            defaultValue=""
                            render={({ field }) => <TextField {...field} margin="dense" label="Должность" type="text" fullWidth variant="standard" />}
                        />
                        <Controller
                            name="specialization"
                            control={control}
                            defaultValue=""
                            render={({ field }) => <TextField {...field} margin="dense" label="Специализация" type="text" fullWidth variant="standard" />}
                        />
                        <TextField type="file" margin="dense" fullWidth variant="standard" onChange={handleFileChange} />
                        <DialogActions>
                            <Button onClick={handleCloseCreateDialog}>Отмена</Button>
                            <Button type="submit">Создать</Button>
                        </DialogActions>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Dialog for Editing an Employee */}
            <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
                <DialogTitle>Изменить сотрудника</DialogTitle>
                <DialogContent>
                    <form onSubmit={handleSubmit((data) => handleCreateOrUpdateEmployee(data, false))}>
                        <Controller
                            name="name"
                            control={control}
                            defaultValue=""
                            render={({ field }) => <TextField {...field} autoFocus margin="dense" label="Имя" type="text" fullWidth variant="standard" />}
                        />
                        <Controller
                            name="position"
                            control={control}
                            defaultValue=""
                            render={({ field }) => <TextField {...field} margin="dense" label="Должность" type="text" fullWidth variant="standard" />}
                        />
                        <Controller
                            name="specialization"
                            control={control}
                            defaultValue=""
                            render={({ field }) => <TextField {...field} margin="dense" label="Специализация" type="text" fullWidth variant="standard" />}
                        />
                        <TextField type="file" margin="dense" fullWidth variant="standard" onChange={handleFileChange} />
                        <DialogActions>
                            <Button onClick={handleCloseEditDialog}>Отмена</Button>
                            <Button type="submit">Сохранить</Button>
                        </DialogActions>
                    </form>
                </DialogContent>
            </Dialog>

            <ToastContainer />
        </div>
    );
};

export default EmployeesAdminPage;
