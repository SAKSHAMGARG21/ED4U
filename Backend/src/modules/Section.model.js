import mongoose, { Schema } from "mongoose"

const sectionSchema = new Schema({

    sectionName:{
        type:String,
    },
    subsection:[
        {
            type:mongoose.Schema.Types.ObjectId,
            required:true,
            ref:"Subsection",
        }
    ],
}, { timestamps: true });

export const Section = mongoose.model("Section", sectionSchema);
