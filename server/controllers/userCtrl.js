const { User } = require("../models/userSchema");
const ErrorHandler = require("../utils/ErrorHandler");
const sendToken = require("../utils/sendToken");
const bcrypt=require("bcrypt")
// Middleware to convert username and email to lowercase

// Register a User
exports.registerUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    // const lowercaseEmail=email.toLowerCase()
    const existsUser = await User.findOne({
      $or: [{ email: email }, { username: email }],
    }).select("+password");

    if (existsUser) {
      return next(new ErrorHandler("Username or email already exists", 500));
    }
    const user = await User.create(req.body);

    sendToken(user, 201, res);
  } catch (error) {
    next(error);
  }
};
// Login User
exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // checking if user has given password and email both

    if (!email || !password) {
      return next(new ErrorHandler("Please Enter Email & Password", 400));
    }

    const user = await User.findOne({
      $or: [{ email: email }, { username: email }],
    }).select("+password");

    if (!user) {
      return next(new ErrorHandler("User Not Found", 401));
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
      return next(new ErrorHandler("Invalid  password", 401));
    }

    sendToken(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// Get User Detail
exports.getUserDetails = async (req, res, next) => {
  try {
    // console.log(req.user.id)    //req.user.id and req.user._id both are same id are virtual id for _id
    const user = await User.findById(req.user).select("-password");

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// Logout User
exports.logout = async (req, res, next) => {
  try {
    res.cookie("token", "", {
      expires: new Date(Date.now(0)),
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    return res.status(200).json({
      success: true,
      message: "Logged Out",
    });
  } catch (error) {
    next(error);
  }
};

//// Get Users for admin
exports.getUsers = async (req, res, next) => {
  try {
    // console.log(req.user.id)    //req.user.id and req.user._id both are same id are virtual id for _id
    const user = await User.findById(req.user.id);

    const users = await User.find();
    const usersCount = await User.find().countDocuments();
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }
    if (user.role !== "admin") {
      return next(new ErrorHandler("You are not an admin", 401));
    }
    res.status(200).json({
      success: true,
      count: usersCount,
      users,
    });
  } catch (error) {
    next(error);
  }
};

//update own user

exports.updateUserByMe = async (req, res, next) => {
  try {
    const { id } = req.user;
    const updateFields = {}; // Create an object to store the fields to update
    console.log(req.body);
    if (req.body.username !== undefined) {
      const existingUser = await User.findOne({ username: req.body.username });
      if (existingUser && existingUser.id !== id) {
        return next(new ErrorHandler("Username already exists", 400));
      }
      updateFields.username = req.body.username;
    }

    if (req.body.email !== undefined) {
      const existingUser = await User.findOne({ email: req.body.email });
      if (existingUser && existingUser.id !== id) {
        return next(new ErrorHandler("Email already exists", 400));
      }
      updateFields.email = req.body.email;
    }
    
    if (req.body.password !== undefined && req.body.password !== "") {
      console.log(363);
      if (req.body.password?.length <= 5) {
        return next(
          new ErrorHandler("Password must be at least 6 characters long!", 400)
        );
      }

      updateFields.password = await bcrypt.hash(req.body.password, 10);
    }

    if (req.body.bio !== undefined) {
      updateFields.bio = req.body.bio;
    }

    if (req.body.phone !== undefined) {
      updateFields.phone = req.body.phone;
    }

    const user = await User.findByIdAndUpdate(id, updateFields, {
      new: true,
      upsert: true,
    });

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "User updated Successfully!",
      user,
    });
  } catch (error) {
    next(error);
  }
};

//update by admin
exports.updateUserByAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Ensure the user performing the update is an admin
    if (req.user.role !== "admin") {
      return next(new ErrorHandler("Only admins can update users", 403));
    }

    const user = await User.findByIdAndUpdate(id, req.body, { new: true, upsert: true });

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "User updated Successfully!",
      user,
    });
  } catch (error) {
    next(error);
  }
};

// Delete Own User
exports.deleteOwnUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    await user.remove();

    res.cookie("token", "", {
      expires: new Date(Date.now(0)),
      httpOnly: true,
    });

    return res.status(200).json({
      success: true,
      message: "User deleted",
    });
  } catch (error) {
    next(error);
  }
};
// Delete User by Admin
exports.deleteAdminUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Ensure the user performing the deletion is an admin
    if (req.user.role !== "admin") {
      return next(new ErrorHandler("Only admins can delete users", 403));
    }

    const user = await User.findById(id);

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    await user.remove();

    res.status(200).json({
      success: true,
      message: "User deleted",
    });
  } catch (error) {
    next(error);
  }
};
