import mongoose from "mongoose"
import { config } from "./config.js";


 const DbConnect = async ()=>{
    await mongoose.connect(config.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('Connection done from db')
}


export default DbConnect;
