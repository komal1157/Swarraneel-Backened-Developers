import authModel from '../models/authModel';
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const twilio = require('twilio');

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

// Register User
exports.register = async (req, res) => {
  const { firstname, lastname, email, password, confirmpassword, contactno, city,  identificationtype, identificationnumber } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ firstname, lastname, email, password: hashedPassword, confirmpassword,contactno, city,identificationtype, identificationnumber });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Error registering user' });
  }
};

// Login User
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await authModel.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Error logging in' });
  }
};


exports.sendOTP = async (req, res) => {
  const { email, contactno } = req.body;

  try {
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); 
    const user = await authModel.findOne({ email });

    if (user) {
      user.otp = otp;
      user.otpExpiration = Date.now() + 300000;
      await user.save();

      await transporter.sendMail({
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is ${otp}`,
      });

      await twilioClient.messages.create({
        body: `Your OTP code is ${otp}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: contactno,
      });

      res.json({ message: 'OTP sent successfully!' });
    } else {
      res.status(400).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error sending OTP' });
  }
};

exports.verifyOTPAndResetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
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
};

export default   authController 
