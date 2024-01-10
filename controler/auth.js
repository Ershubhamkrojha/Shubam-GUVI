import bcrypt from 'bcrypt';
import User from '../model/User.js';
import  Jwt from 'jsonwebtoken'
import { createError } from '../util/Util.js';

export const register = async (req, res,next) => {
    console.log(req.body);
    try {
        if (!/^[\w-]+(?:\.[\w-]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,7}$/.test(req.body.userEmail)) {
          return next(createError(400, "Invalid email format"));
            // return res.status(400).json({ error: 'Invalid email format' });
        }
        const passwordRegex = /^(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])[A-Za-z\d!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]{8,}$/;
        if (!passwordRegex.test(req.body.userPassword)) {
          return next(createError(400, "Password must be at least 8 characters long and contain at least one special character"));
          // return res.status(400).json({ error: 'Password must be at least 8 characters long and contain at least one special character' });
        }

        const salt1 = await bcrypt.genSaltSync(10);
        const hash1 = await bcrypt.hashSync(req.body.userPassword, salt1);

        const salt2 = await bcrypt.genSaltSync(10);
        const hash2 = await bcrypt.hashSync(req.body.userConfirmPassword, salt2);

        // Check if password and confirmPassword match
        if (req.body.userPassword === req.body.userConfirmPassword) {
            const newUser = new User({
                username: req.body.userName,
                email: req.body.userEmail,
                password: hash1,
                confirmPassword: hash2
            });
            const user = await newUser.save();
            const { password, ...otherDetails } = user._doc;
            return res.status(200).json({ message: 'User has been registered', user: otherDetails });
        } else {
          return next(createError(404, "Password and confirmPassword do not match"));
            // return res.status(400).json({ error: 'Password and confirmPassword do not match' });
        }
    } catch (error) {
      next(error)
        // console.error('Error during user registration:', error);
        // return res.status(500).json({ error: 'Internal server error. User not created.' });
    }
};




export const login = async (req, res,next) => {
  try {
    const { userEmail, userPassword } = req.body;

    // Check if the user exists in the database
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return next(createError(404, "User not found"))
    }

    // Check if the provided password matches the hashed password in the database
    const isPasswordValid = await bcrypt.compare(userPassword, user.password);
    if (!isPasswordValid) { 
      return next(createError(404, "Wrong Password"));
    }
    const token=Jwt.sign({id:user._id},process.env.JWT);
    console.log(token)

    // If the email and password are valid, send a success response
    const { password, ...userInfo } = user._doc;
    res.cookie("access_token",token,{
      httpOnly:true,
    }).status(200).json({ message: "User login successful", userInfo });
  } catch (error) {
    next(error)
    
    // res.status(500).json({ error: err.message });
  }
};


export const updateUser = async (req, res, next) => {
  try {
    
      const updateUser = await User.findByIdAndUpdate(
          req.params.id, { $set: req.body }, { new: true }
      );
      res.status(200).json(updateUser)

  } catch (error) {
      // res.status(500).json(error)
      next(error)
  }
}
export const getUserById = async (req, res, next) => {
  try {
      const user= await User.findById(
          req.params.id
      );
      res.status(200).json(user)


  } catch (error) {
      // res.status(500).json(error)
      next(error)
  }
}