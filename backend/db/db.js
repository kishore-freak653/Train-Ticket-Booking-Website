import mongoose from 'mongoose';
import * as dotenv from "dotenv";

dotenv.config();
const connectDB = async () =>{
  try {
    const connect = await mongoose.connect(`${process.env.MONGODB_URI }`);
    console.log(`Connected to MongoDB Database : ${connect.connection.host}`);
  } catch (error) {
     console.error(`Error: ${error.message}`);
     process.exit(1);
  }
} 

export default connectDB;