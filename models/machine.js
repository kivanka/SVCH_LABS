import mongoose from "mongoose";

const MachineShema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        imageUrl: String,
        condition: {
            type: String,
            required: true,
        },
        serviceDates: [{
            type: Date,
        }]
    },
    {
        timestamps: true,
    },
)

export default mongoose.model('Part', MachineShema);