import mongoose, { Schema } from "mongoose"

const courseProg = new Schema({
    courseId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course",
    },
    completedVideos:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Subsection",
        }
    ]
}, { timestamps: true });

export const courseProgress = mongoose.model("CoursesProgress", courseProg);
