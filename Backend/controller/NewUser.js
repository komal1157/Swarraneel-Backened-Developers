import User from "../models/UserModel.js"

export const CreateUser = async (req, res) => {
  
  const { name, email, subject, message } = req.body;
  try {
    // create a new user entry
    const newUser = new User
      ({
        name,
        email,
        subject,
        message
      });
    //save the user to the database
    const savedUser = await newUser.save();
    // send success response
    res.json({
      success: true,
      data: savedUser,
      message: "Form submitted successfully",
    })
  }
  catch (e) {
    // send error response
    res.status(500).json({
      message: e.message,
    })
  }
}
export default CreateUser;