import mongoose, { Schema } from "mongoose"

const courseProg = new Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    completedVideos: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Subsection",
        }
    ]
}, { timestamps: true });

export const CourseProgress = mongoose.model("CoursesProgress", courseProg);
