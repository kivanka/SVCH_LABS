import OrderModel from '../models/order.js';

export const create = async (req, res) => {
    try {
        const doc = new OrderModel({
            user: req.userId,
            description: req.body.description,
            status: req.body.status,
            price: req.body.price,
            product: req.body.product,
        });

        const order = await doc.save();

        res.json(order);
    } catch(err) {
        console.log(err);
        res.status(500).json({
            message: 'Create attempt failed',
        });
    }
};

export const remove = async (req, res) => {
    try{
        const orderId = req.params.id;

        const doc = await OrderModel.findByIdAndDelete(orderId);

        if (!doc) {
            return res.status(404).json({
                message: 'Order doesn\'t exist',
            });
        }

        res.json({
            success: true,
        });
    } catch(err) {
        console.log(err);
        res.status(500).json({
            message: 'Remove attempt failed',
        });
    }
};

export const update = async (req, res) => {
    try {
        const orderId = req.params.id;

        await OrderModel.updateOne(
            {
                _id: orderId,
            },
            {
                description: req.body.description,
                status: req.body.status,
                price: req.body.price,
                product: req.body.product,
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
    try{
        const orderId = req.params.id;

        const doc = await OrderModel.findById(orderId).populate('user');;

        if (doc) {
            res.json(doc);
        } else {
            res.status(404).json({ message: 'Order not found' });
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
        const orders = await OrderModel.find().populate('user');
        
        res.json(orders);
    } catch(err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to retrieve orders',
        });
    }
};