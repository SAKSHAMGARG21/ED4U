import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    videos: [
        {
            type: String,
        }
    ],
}, { timestamps: true });

export const Media = mongoose.model('Media', mediaSchema);
