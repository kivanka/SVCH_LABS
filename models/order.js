import mongoose from "mongoose";

const OrderShema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        }, 
        description: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            required: true,
            enum: ['pending', 'inProgress', 'completed', 'declined'] 
        },
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Machine',
            required: true,
        },
    },
    {
        timestamps: true,
    },
)

export default mongoose.model('Order', OrderShema);