import mongoose from "mongoose";
import { DB_NAME } from "../constrants.js";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}${DB_NAME}`);
        console.log(`${process.env.MONGO_URI}${DB_NAME}`)
        console.log(`\nMongoDB Connected || DB Host: ${connectionInstance.connection.host}`)
    } catch (error) {
        console.log(`Error in connecting to mongodb : ${error}`)
        process.exit(1);
    }
}

export default connectDB