import mongoose, { Schema } from "mongoose";

const likeSchema = new Schema({
    comments: {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
        default:null
    },
    video: {
        type: Schema.Types.ObjectId,
        ref: 'Vedio'
    },
    likedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
}, {
    timestamps: true
})

export const Like = mongoose.model("Like", likeSchema);