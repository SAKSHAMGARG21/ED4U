import mongoose, { Mongoose, Schema } from "mongoose"

const ratingAndReviewsSchema = new Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User",
    },
    rating:{
        type:Number,
        required:true,
    },
    review:{
        type:String,
        required:true,
    },
    course:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"Course",
        index:true,
    }
}, { timestamps: true });

export const RatingAndReview = mongoose.model("RatingAndReview", ratingAndReviewsSchema);
