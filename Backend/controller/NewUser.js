import User from "../models/UserModel.js";

export const userForm = async (req, res) => {
  const { name, email, subject, message } = req.body;

  try {
    // Create new user entry
    const newUser = new User({
      name,
      email,
      subject,
      message,
    });

    // Save the user to the database
    const savedUser = await newUser.save();

    // Send success response
    res.json({
      success: true,
      data: savedUser,
      message: "Form submitted successfully!",
    });
  } catch (e) {
    // Handle any errors during the save process
    res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

export default userForm;