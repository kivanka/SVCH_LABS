import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors';

import {
    userController,
    employeeController,
    machineController,
    orderController,
} from './controllers/index.js';

import {
    loginValidation,
    registerValidation,
    createEmployeeValidate,
    updateEmployeeValidate,
    createMachineValidation,
    updateMachineValidation,
    createOrderValidation,
    updateOrderValidation,
} from './validations.js';

import {
    handleValidationErrors,
    allRolesAuth,
    adminOnlyAuth,
} from './utils/index.js';

mongoose
    .connect('mongodb+srv://admin:Hesus2016@cluster0.vgtv5yo.mongodb.net/MachineCheck')
    .then(() => console.log('DB OK'))
    .catch((err) => console.log('DB ERROR', err));

const app = express();

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads')
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname)
    },
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

// media upload pathes
app.post('/upload', upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    });
});

//auth
app.post('/auth/login', loginValidation, handleValidationErrors, userController.login);
app.post('/auth/register', registerValidation, handleValidationErrors, userController.register);
app.get('/auth/me', allRolesAuth, userController.getMe);

//employees
app.post('/employees/create',
    adminOnlyAuth,
    createEmployeeValidate,
    handleValidationErrors,
    employeeController.create
);
app.delete('/employees/:id/delete',
    adminOnlyAuth,
    employeeController.remove
);
app.patch('/employees/:id/update',
    adminOnlyAuth,
    updateEmployeeValidate,
    handleValidationErrors,
    employeeController.update
);
app.get('/employees/:id',
    employeeController.getOne
);
app.get('/employees',
    employeeController.getAll
);

//machine
app.post('/machine/create',
    adminOnlyAuth,
    createMachineValidation,
    handleValidationErrors,
    machineController.create
);
app.delete('/machine/:id/delete',
    adminOnlyAuth,
    machineController.remove
);
app.patch('/machine/:id/update',
    adminOnlyAuth,
    updateMachineValidation,
    handleValidationErrors,
    machineController.update
);
app.get('/machine/:id',
    machineController.getOne
);
app.get('/machine',
    machineController.getAll
);

//orders
app.post('/orders/create',
    allRolesAuth,
    createOrderValidation,
    handleValidationErrors,
    orderController.create
);
app.delete('/orders/:id/delete',
    adminOnlyAuth,
    orderController.remove
);
app.patch('/orders/:id/update',
    adminOnlyAuth,
    updateOrderValidation,
    handleValidationErrors,
    orderController.update
);
app.get('/orders/:id',
    allRolesAuth,
    orderController.getOne
);
app.get('/orders',
    allRolesAuth,
    orderController.getAll
);

app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }

    console.log('Server OK');
});