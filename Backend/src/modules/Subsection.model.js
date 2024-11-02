import mongoose, { Schema } from "mongoose"

const subsectionSchema = new Schema({
    title:{
        type:String,
    },
    timeDuration:{
        type:String,
    },
    description:{
        type:String,
    },
    VideoUrl:{
        type:String,
    }
}, { timestamps: true });

export const Subsection = mongoose.model("Subsection", subsectionSchema);
