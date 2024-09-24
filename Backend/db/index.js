import mongoose from "mongoose";

const connectDB=async()=>{
  try {
      const conn =await mongoose.connect(process.env.MONGO_URL)
      if(conn){
          console.log("commect connection");
          
      }
  } catch (error) {
      console.log(error.message);
      
  }
}


export default connectDB;