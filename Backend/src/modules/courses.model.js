import mongoose from "mongoose"

const courcesSchema = new mongoose.Schema({
    courseName: {
        type: String,
        required:true,
    },
    courseDescription: {
        type: String,
        required:true,
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    whatWillYouLearn: {
        type: String,
        required:true,
    },
    courseContent: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Section"
        }
    ],
    ratingAndReviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "RationgAndReviews",
        }
    ],
    price: {
        type: Number,
    },
    thumbnail: {
        type: String,
    },
    tag:{
        type:[String],
        required:true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
    },
    studentsEnrolled: [
        {
            type:mongoose.Schema.Types.ObjectId,
            required:true,
            ref:"User",
        }
    ],
    instructions: {
		type: String,
	},
	status: {
		type: String,
		enum: ["Draft", "Published"],
	},

}, { timestamps: true });

export const Course = mongoose.model("Course", courcesSchema);
