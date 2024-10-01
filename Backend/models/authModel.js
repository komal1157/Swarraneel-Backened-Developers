import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },

  lastname: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  contactno: {
    type: String,
    required: true,
  },

  city: {
    type: String,
    required: true,
  },

  identificationtype: {
    type: String,
    required: true,
  },

  identificationnumber: {
    type: Number,
    required: true,
  },

  otp: {
    type: String,
  },

  otpExpiration: {
    type: Date,
  },
});

const authModel = mongoose.model("User", UserSchema);

export default authModel;