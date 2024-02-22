import EmployeeModel from '../models/employee.js';

export const create = async (req, res) => {
    try {
        const doc = new EmployeeModel({
            name: req.body.name,
            position: req.body.position,
            specialization: req.body.specialization,
            imageUrl: req.body.imageUrl,
        });

        const employee = await doc.save();

        res.json(employee);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Create attempt failed',
        });
    }
};

export const remove = async (req, res) => {
    try {
        const employeeId = req.params.id;

        const doc = await EmployeeModel.findByIdAndDelete(employeeId);

        if (!doc) {
            return res.status(404).json({
                message: 'Employee doesn\'t exist',
            });
        }

        res.json({
            success: true,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Remove attempt failed',
        });
    }
};

export const update = async (req, res) => {
    try {
        const employeeId = req.params.id;

        await EmployeeModel.updateOne(
            {
                _id: employeeId,
            },
            {
                name: req.body.name,
                position: req.body.position,
                specialization: req.body.specialization,
                imageUrl: req.body.imageUrl,
            },
        );

        res.json({
            success: true,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Update attempt failed',
        });
    }
};

export const getOne = async (req, res) => {
    try {
        const employeeId = req.params.id;

        const doc = await EmployeeModel.findById(employeeId);

        if (doc) {
            res.json(doc);
        } else {
            res.status(404).json({ message: 'Employee not found' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Search attempt failed',
        });
    }
};

export const getAll = async (req, res) => {
    try {
        const employees = await EmployeeModel.find();

        res.json(employees);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to retrieve employees',
        });
    }
};