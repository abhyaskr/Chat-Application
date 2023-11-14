const User = require("../model/userModel");
const bcrypt = require("bcrypt"); // Corrected typo in bcrypt

module.exports.register = async (req, res, next) => {

  try {
    
      const { username, email,password } = req.body;
  
      // Check if username is already used
      const usernameCheck = await User.findOne({ username });
  
      if (usernameCheck) {
        return res.json({ msg: "Username already used", status: false });
      }
  
      // Check if email is already used
      const emailCheck = await User.findOne({ email });
  
      if (emailCheck) {
        return res.json({ msg: "Email already used", status: false });
      }
  
      // If both username and email are available, you can proceed with registration logic here
     
      const hashPassword = await bcrypt.hash(password,10);
      const user = await User.create({
          email,
          username,
          password: hashPassword,
      });
      delete user.password;
      return res.json({status: true,user});
  } catch (error) {
    next(error);
  } 

};


module.exports.login = async (req, res, next) => {

  try {
    
      const { username,password } = req.body;
  
      // Check if username is already used
      const user = await User.findOne({ username });
  
      if (!user) {
        return res.json({ msg: "Incorrect Username or password", status: false });
      }
  
      const isPasswordValid = await bcrypt.compare(password,user.password);
  
      if (!isPasswordValid) {
        return res.json({ msg: "Incorrect Username or Password", status: false });
      }
      delete user.password;
     
    return res.json({status: true,user});
  } catch (error) {
    next(error);
  } 

};
module.exports.setAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const avatarImage = req.body.image;
    const userData = await User.findByIdAndUpdate(
      userId,
      {
        isAvatarImageSet: true,
        avatarImage,
      },
      { new: true }
    );

    if (!userData) {
      // If user is not found, return a 404 status code and an error message
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({
      isSet: userData.isAvatarImageSet,
      image: userData.avatarImage,
    });
  } catch (ex) {
    // Log the error for debugging purposes
    console.error("Error setting avatar:", ex);
    // Pass the error to the error handling middleware
    next(ex);
  }
};
module.exports.getAllUserRoute = async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.params.id } })
      .select(["email", "username", "avatarImage", "_id"]);

    return res.json(users);
    console.log(users);
  } catch (error) {
  console.log("data not fetch" ,error);
  }
};


