import express from "express";
import connectDB from './db/index.js';
import UserRoute from "./routes/UserRoute.js";
import authRoutes from "./routes/authRoutes.js";
import dotenv from 'dotenv';
import cors from 'cors';
import CreateUser from "./controllers/NewUser.js";
import  authController, { register } from "./controllers/authController.js";
import axios from "axios";

// Load environment variables from .env file
dotenv.config();

const app = express();

const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

const PORT = process.env.PORT;

// Middleware
app.use(express.json());

app.use("/NewUser",  UserRoute);

app.use("/authController",  authRoutes);

connectDB();

app.post('/User', CreateUser);//post request to store data

app.post('/User',register);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
