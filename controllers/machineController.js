import MachineModel from '../models/machine.js';

export const create = async (req, res) => {
    try {
        const doc = new MachineModel({
            name: req.body.name,
            model: req.body.model,
            condition: req.body.condition,
            imageUrl: req.body.imageUrl,
            serviceDates: req.body.serviceDates,
        });

        const machine = await doc.save();

        res.json(machine);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Create attempt failed',
        });
    }
};

export const remove = async (req, res) => {
    try {
        const machineId = req.params.id;

        const doc = await MachineModel.findByIdAndDelete(machineId);

        if (!doc) {
            return res.status(404).json({
                message: 'machine doesn\'t exist',
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
        const machineId = req.params.id;

        await MachineModel.updateOne(
            {
                _id: machineId,
            },
            {
                name: req.body.name,
                model: req.body.model,
                condition: req.body.condition,
                imageUrl: req.body.imageUrl,
                serviceDates: req.body.serviceDates,
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
        const machineId = req.params.id;

        const doc = await MachineModel.findById(machineId);

        if (doc) {
            res.json(doc);
        } else {
            res.status(404).json({ message: 'machine not found' });
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
        const machines = await MachineModel.find();

        res.json(machines);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to retrieve machines',
        });
    }
};