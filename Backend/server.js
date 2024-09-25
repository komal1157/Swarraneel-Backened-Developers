import express from "express";
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import userForm from "./controller/NewUser.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());


const MongoDBConn = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URL, {

    });



    console.log('MongoDB connected');
  } catch (e) {
    console.log('Error connecting to MongoDB:', e.message);
  }
};

MongoDBConn();

app.post('/userInfo', userForm ); //post request to store data 

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
