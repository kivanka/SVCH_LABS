import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
                        type="text"
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

            <ToastContainer />
        </div>
    );
};

export default EmployeesAdminPage;
