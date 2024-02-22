import mongoose from "mongoose";

const EmployeeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        position: {
            type: String,
            required: true,
        },
        specialization: {
            type: String,
            required: true,
        },
        imageUrl: String,
    },
    {
        timestamps: true,
    },
)

export default mongoose.model('Employee', EmployeeSchema);