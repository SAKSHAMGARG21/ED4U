import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { DB_NAME } from '../constants.js';

dotenv.config({
    path: ".env"
})

const connectDb = async() => {
    try {
        const respose = await mongoose.connect(`${process.env.MONGO_URI}${DB_NAME}`);
        console.log(`${process.env.MONGO_URI}${DB_NAME}`);
        console.log(`\nMongoDB Connected: ${respose.connection.host}`);
    }catch(err){
        console.log('Error in connecting with Mongodb',err);
        process.exit(1);
    }
}

export  default connectDb;
