import express from "express";

import { CreateUser } from "../controllers/NewUser.js";

const router = express.Router();

router.post("/User",CreateUser)

export default router