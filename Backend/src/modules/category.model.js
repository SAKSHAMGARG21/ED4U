import mongoose, { Schema } from "mongoose"

const CategorySchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    courses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
        }
    ]
}, { timestamps: true });

export const Category = mongoose.model("Category", CategorySchema);
