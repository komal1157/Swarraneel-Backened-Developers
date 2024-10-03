import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import twilio from 'twilio';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import authModel from '../models/authModel.js';

// Load environment variables from .env file
dotenv.config();

// Check if Twilio credentials are loaded
console.log('TWILIO_SID:', process.env.TWILIO_SID);
console.log('TWILIO_AUTH_TOKEN:', process.env.TWILIO_AUTH_TOKEN);
console.log('TWILIO_PHONE_NUMBER:', process.env.TWILIO_PHONE_NUMBER);


// Email setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Twilio setup
const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

if (!process.env.TWILIO_SID || !process.env.TWILIO_AUTH_TOKEN) {
  console.error('Twilio credentials are not set correctly!');
}

// Register User
export async function register(req, res) {
  try {
    const { firstname, lastname, email, password, confirmpassword, contactno, city, identificationtype, identificationnumber } = req.body;

    // Password confirmation check
    if (password !== confirmpassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new authModel({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      contactno,
      city,
      identificationtype,
      identificationnumber,
    });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Error registering user' });
  }
}

// Login User
export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await authModel.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Error logging in' });
  }
}

// Send OTP
//both email or mobile NUmber
export async function sendOTP(req, res) {
  try {
    const { email, contactno } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const user = await authModel.findOne({ email });
    if (user) {
      user.otp = otp;
      user.otpExpiration = Date.now() + 300000; // 5 minutes
      await user.save();

      await transporter.sendMail({
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is ${otp}`,
      });

      await twilioClient.messages.create({
        body: `Your OTP code is ${otp}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: contactno, // Ensure this is in E.164 format
      });

      res.json({ message: 'OTP sent successfully!' });
    } else {
      res.status(400).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error sending OTP' });
  }
}

// Verify OTP and Reset Password
export async function verifyOTPAndResetPassword(req, res) {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await authModel.findOne({ email });
    if (!user) return res.status(400).json({ error: 'User not found' });
    if (user.otp !== otp || Date.now() > user.otpExpiration) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }
    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = undefined;
    user.otpExpiration = undefined;
    await user.save();
    res.json({ message: 'Password reset successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Error resetting password' });
  }
}

export default { register, login, sendOTP, verifyOTPAndResetPassword };