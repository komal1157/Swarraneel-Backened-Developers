import mongoose from "mongoose";
const connectDB = async () => {
  // MongoDB connection
  try {
    const connection = await mongoose.connect('mongodb+srv://root:root@cluster0.jout6.mongodb.net/User', {
      dbName: "User",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log("Mongoose connected ");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }

}
export default connectDB;