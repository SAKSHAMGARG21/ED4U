import mongoose,{Schema} from "mongoose"
import mongooseAP from "mongoose-aggregate-paginate-v2"


const videoSchema=new Schema({
    videoFile:{
        type:Object, // cloudinary URL
        required:true
    },
    thumbnail:{
        type:Object, // cloudinary URL
        required:true
    },
    title:{
        type:String,
        required:true
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    description:{
        type:String,
        required:true
    },
    duration:{
        type:Number,
        required:true
    },
    views:{
        type:Number,
        default:0
    },
    isPublished:{
        type:Boolean,
        default:true
    }
},{timestamps:true});

videoSchema.plugin(mongooseAP);

export const Video=mongoose.model("Video",videoSchema);