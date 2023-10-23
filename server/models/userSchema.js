const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,

      required: [true, "Please enter your userName"],
      unique: true,
    },

    email: {
      type: String,
      required: [true, "Please enter your email address"],
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: [6, "Password must be at least 6 characters long!"],
    },
    
    bio: String,
    phone:String,
    
    role: {
      type: String,
      default: "user",
    },
    avatar: {
      type: String,

      default:
        "https://res.cloudinary.com/asikur/image/upload/v1697815502/Lovepik_com-401205594-cartoon-avatar_fmvsfi.png",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  this.username = this.username.toLowerCase();
  this.email = this.email.toLowerCase();
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Generate a JSON Web Token (JWT) for the user
userSchema.methods.generateToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE, // You can set the expiration time as needed
  });
  return token;
};
exports.User = mongoose.model("User", userSchema);
