import { mongo, Schema } from "mongoose";
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        subject: {
            type: String,
            required: true
        },
        message: {
            type: String,
            required: true
        }
    }
)

const User = mongoose.model("User", UserSchema);

export default User;